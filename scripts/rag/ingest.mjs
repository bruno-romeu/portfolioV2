// Ingestão da base de conhecimento do chat (rag/conteudo/*.md) no Pinecone.
//
// Uso (a partir da raiz do repositório):
//   npm run rag:ingest -- --dry-run   só gera os chunks e embeddings, sem tocar no Pinecone
//   npm run rag:ingest -- --export    salva o conteúdo atual do índice em rag/export-indice-atual.json
//   npm run rag:ingest                faz upsert da base e informa quantos vetores antigos sobraram
//   npm run rag:ingest -- --prune     faz upsert e apaga os vetores que não fazem parte da base
//
// A configuração do embedding precisa ser idêntica à de api/chat.ts, senão as
// perguntas e os trechos indexados ficam em espaços vetoriais diferentes.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from '@huggingface/transformers';

const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
const EMBEDDING_DTYPE = 'q8';
const EMBEDDING_DIMENSION = 384;
const PINECONE_INDEX = 'portfoliorag';

const MAX_CHUNK_CHARS = 1200;
const UPSERT_BATCH_SIZE = 100;
const FETCH_BATCH_SIZE = 100;
const DELETE_BATCH_SIZE = 1000;
const ID_PREFIX = 'kb:';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTENT_DIR = path.join(ROOT, 'rag', 'conteudo');
const EXPORT_FILE = path.join(ROOT, 'rag', 'export-indice-atual.json');

const args = new Set(process.argv.slice(2));
const KNOWN_FLAGS = new Set(['--dry-run', '--export', '--prune']);
for (const arg of args) {
  if (!KNOWN_FLAGS.has(arg)) fail(`Flag desconhecida: ${arg}. Use --dry-run, --export ou --prune.`);
}
const DRY_RUN = args.has('--dry-run');
const EXPORT = args.has('--export');
const PRUNE = args.has('--prune');
if ([DRY_RUN, EXPORT, PRUNE].filter(Boolean).length > 1) {
  fail('Use apenas uma flag por vez (--dry-run, --export ou --prune).');
}

function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Leitura e chunking
// ---------------------------------------------------------------------------

/** Quebra uma seção longa por parágrafos, agrupando até MAX_CHUNK_CHARS. */
function splitByParagraphs(text) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const parts = [];
  let current = '';
  for (const paragraph of paragraphs) {
    if (current && current.length + 2 + paragraph.length > MAX_CHUNK_CHARS) {
      parts.push(current);
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/** Lê um arquivo Markdown e devolve os chunks das seções `##`. */
function chunkFile(fileName, markdown) {
  const base = fileName.replace(/\.md$/, '');
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const titleLine = lines.find((line) => /^#\s+/.test(line));
  const docTitle = titleLine ? titleLine.replace(/^#\s+/, '').trim() : base;

  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      current = { title: heading[1].trim(), body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push(line);
    }
  }

  const chunks = [];
  for (const section of sections) {
    const body = section.body.join('\n').trim();
    if (!body) continue;
    const pieces = body.length > MAX_CHUNK_CHARS ? splitByParagraphs(body) : [body];
    for (const piece of pieces) {
      chunks.push({
        id: `${ID_PREFIX}${base}:${chunks.length + 1}`,
        text: `# ${docTitle} — ${section.title}\n\n${piece}`,
        source: fileName,
        section: section.title,
      });
    }
  }
  if (chunks.length === 0) console.warn(`Aviso: ${fileName} não tem nenhuma seção "##" com texto.`);
  return chunks;
}

async function loadChunks() {
  const files = (await readdir(CONTENT_DIR)).filter((name) => name.endsWith('.md')).sort();
  if (files.length === 0) fail(`Nenhum arquivo .md encontrado em ${CONTENT_DIR}.`);
  const chunks = [];
  for (const file of files) {
    const markdown = await readFile(path.join(CONTENT_DIR, file), 'utf8');
    chunks.push(...chunkFile(file, markdown));
  }
  return { files, chunks };
}

// ---------------------------------------------------------------------------
// Embeddings (mesma configuração de api/chat.ts)
// ---------------------------------------------------------------------------

async function embedChunks(chunks) {
  const extractor = await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: EMBEDDING_DTYPE });
  const vectors = [];
  for (const chunk of chunks) {
    const output = await extractor(chunk.text, { pooling: 'mean', normalize: true });
    const vector = Array.from(output.data, Number);
    if (vector.length !== EMBEDDING_DIMENSION || !vector.every(Number.isFinite)) {
      fail(`Embedding inválido para ${chunk.id} (dimensão ${vector.length}, esperado ${EMBEDDING_DIMENSION}).`);
    }
    vectors.push(vector);
  }
  return vectors;
}

// ---------------------------------------------------------------------------
// Pinecone
// ---------------------------------------------------------------------------

async function openIndex() {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    fail(
      'PINECONE_API_KEY não definida. Coloque-a no .env.local (ignorado pelo git) ' +
        'ou exporte no terminal antes de rodar. Para testar sem Pinecone, use --dry-run.',
    );
  }
  const { Pinecone } = await import('@pinecone-database/pinecone');
  const pinecone = new Pinecone({ apiKey });
  return pinecone.index({ name: PINECONE_INDEX });
}

/** Lista todos os IDs do namespace padrão. listPaginated só existe em índices serverless. */
async function listAllIds(index) {
  const ids = [];
  let paginationToken;
  do {
    let page;
    try {
      page = await index.listPaginated({ limit: 100, paginationToken });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      fail(
        `Não foi possível listar os IDs do índice "${PINECONE_INDEX}": ${message}\n` +
          'O listPaginated só é suportado em índices serverless. Em índices pod-based, ' +
          'não há como listar os vetores existentes por este script.',
      );
    }
    for (const vector of page.vectors ?? []) if (vector.id) ids.push(vector.id);
    paginationToken = page.pagination?.next;
  } while (paginationToken);
  return ids;
}

async function exportIndex(index) {
  const ids = await listAllIds(index);
  const records = [];
  for (let i = 0; i < ids.length; i += FETCH_BATCH_SIZE) {
    const batch = ids.slice(i, i + FETCH_BATCH_SIZE);
    const response = await index.fetch({ ids: batch });
    for (const id of batch) {
      const record = response.records?.[id];
      records.push({ id, text: record?.metadata?.text ?? null, metadata: record?.metadata ?? null });
    }
  }
  records.sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(
    EXPORT_FILE,
    `${JSON.stringify({ index: PINECONE_INDEX, exportedAt: new Date().toISOString(), total: records.length, records }, null, 2)}\n`,
    'utf8',
  );
  console.log(`Exportados ${records.length} vetores do índice "${PINECONE_INDEX}" para ${path.relative(ROOT, EXPORT_FILE)}.`);
}

async function upsertChunks(index, chunks, vectors) {
  const records = chunks.map((chunk, i) => ({
    id: chunk.id,
    values: vectors[i],
    metadata: { text: chunk.text, source: chunk.source, section: chunk.section },
  }));
  for (let i = 0; i < records.length; i += UPSERT_BATCH_SIZE) {
    const batch = records.slice(i, i + UPSERT_BATCH_SIZE);
    await index.upsert({ records: batch });
    console.log(`Upsert: ${Math.min(i + UPSERT_BATCH_SIZE, records.length)}/${records.length}`);
  }
}

async function handleStaleVectors(index, chunks) {
  const currentIds = new Set(chunks.map((chunk) => chunk.id));
  const existingIds = await listAllIds(index);
  const stale = existingIds.filter((id) => !currentIds.has(id)).sort();

  if (stale.length === 0) {
    console.log('Nenhum vetor antigo no índice: só a base nova está indexada.');
    return;
  }
  if (!PRUNE) {
    console.log(
      `Restam ${stale.length} vetores que não fazem parte da base nova. ` +
        'Revise com --export e rode com --prune para apagá-los.',
    );
    return;
  }

  console.log(`Apagando ${stale.length} vetores que não fazem parte da base nova:`);
  for (const id of stale) console.log(`  - ${id}`);
  for (let i = 0; i < stale.length; i += DELETE_BATCH_SIZE) {
    await index.deleteMany({ ids: stale.slice(i, i + DELETE_BATCH_SIZE) });
  }
  console.log('Vetores antigos apagados.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function printSummary(files, chunks) {
  const sizes = chunks.map((chunk) => chunk.text.length);
  const avg = Math.round(sizes.reduce((sum, n) => sum + n, 0) / sizes.length);
  console.log(`Arquivos: ${files.length} | Chunks: ${chunks.length} | Tamanho médio: ${avg} | Máximo: ${Math.max(...sizes)} | Mínimo: ${Math.min(...sizes)}`);
}

async function main() {
  if (EXPORT) {
    await exportIndex(await openIndex());
    return;
  }

  const { files, chunks } = await loadChunks();
  printSummary(files, chunks);

  if (DRY_RUN) {
    console.log('\n--dry-run: nenhuma conexão com o Pinecone.\n');
    for (const chunk of chunks.slice(0, 3)) {
      console.log(`[${chunk.id}] (${chunk.text.length} caracteres)\n${chunk.text}\n`);
    }
  }

  console.log(`Gerando embeddings com ${EMBEDDING_MODEL} (${EMBEDDING_DTYPE})...`);
  const vectors = await embedChunks(chunks);
  console.log(`Embeddings gerados: ${vectors.length}, dimensão ${vectors[0].length}.`);

  if (DRY_RUN) return;

  const index = await openIndex();
  await upsertChunks(index, chunks, vectors);
  await handleStaleVectors(index, chunks);
}

main().catch((error) => {
  console.error('Erro:', error instanceof Error ? error.message : error);
  process.exit(1);
});

# Portfólio — Bruno Romeu da Silva

Portfólio pessoal de desenvolvedor Full Stack, com um assistente de IA ("Bruno AI") que responde perguntas sobre minha trajetória, projetos e stack usando RAG.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, lucide-react
- **Chat:** Vercel AI SDK (`ai` + `@ai-sdk/react`), respostas em streaming renderizadas com `react-markdown`
- **RAG (função serverless em `api/chat.ts`):**
  1. Embedding da pergunta com `all-MiniLM-L6-v2`, gerado dentro da própria função via transformers.js (ONNX, sem API externa nem token)
  2. Busca vetorial no Pinecone (índice `portfoliorag`, top 5)
  3. Geração com `openai/gpt-oss-20b` via Groq (raciocínio baixo e oculto)
- **Deploy:** Vercel

## Rodando localmente

```bash
npm install
npm run dev
```

O `npm run dev` sobe só o frontend. A rota `/api/chat` é uma Vercel Function; para testar o chat localmente, use a Vercel CLI:

```bash
npx vercel dev
```

### Variáveis de ambiente

Crie um `.env` (ignorado pelo git) ou configure no painel da Vercel:

| Variável | Uso |
|---|---|
| `GROQ_API_KEY` | Geração das respostas (Groq) |
| `PINECONE_API_KEY` | Busca do contexto no Pinecone |

## Proteções da API de chat

- Validação do corpo: só mensagens `user`/`assistant`; a última precisa ser do usuário.
- Limites: 1000 caracteres por pergunta, 20 mensagens de histórico, 1000 tokens de saída (incluindo raciocínio).
- Rate limit por IP (10/min, 60/h) em memória. É *best-effort*: em serverless o estado é por instância. Para um limite garantido, use o Firewall da Vercel ou um store como Upstash/Vercel KV.
- Erros sempre em JSON `{ "error": "<mensagem>" }`, sem detalhes internos; o conteúdo das conversas não é logado.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build de produção |
| `npm run lint` | ESLint |
| `npm run preview` | Serve o build localmente |
| `npm run rag:ingest` | Indexa a base de conhecimento do chat no Pinecone (ver abaixo) |

## Embedding local (transformers.js)

O modelo (`Xenova/all-MiniLM-L6-v2`, q8, ~23 MB) é baixado do Hugging Face Hub na primeira requisição de cada instância e guardado em `/tmp`. Isso deixa o *cold start* alguns segundos mais lento, mas elimina custo e cota de API.

- `.npmrc` pula o download dos binários CUDA do `onnxruntime-node` no `postinstall`.
- `vercel.json` exclui da função os binários de outras plataformas e o `onnxruntime-web`, para caber no limite de tamanho.

## Base de conhecimento do chat

O conteúdo que o chat usa como contexto fica em `rag/conteudo/*.md`, um arquivo por tema. Cada seção `##` vira um trecho indexado isoladamente, então cada seção precisa ser autocontida (repetir o nome do Bruno e o assunto) e ter entre 300 e 900 caracteres.

O script `scripts/rag/ingest.mjs` gera os embeddings com a mesma configuração de `api/chat.ts` e grava no índice `portfoliorag`, com IDs `kb:<arquivo>:<n>`. Ele lê `PINECONE_API_KEY` do ambiente ou do `.env.local` (ignorado pelo git).

1. Edite os arquivos em `rag/conteudo`.
2. `npm run rag:ingest -- --dry-run`: gera os trechos e embeddings sem tocar no Pinecone e mostra quantidade, tamanhos e os primeiros trechos.
3. `npm run rag:ingest -- --export`: salva os IDs e textos que estão hoje no índice em `rag/export-indice-atual.json` (ignorado pelo git), para revisão.
4. `npm run rag:ingest`: faz upsert da base e informa quantos vetores antigos (fora da base) continuam no índice.
5. `npm run rag:ingest -- --prune`: faz upsert e apaga os vetores que não fazem parte da base, listando antes quais serão removidos.

# Portfólio — Bruno Romeu da Silva

Portfólio pessoal de desenvolvedor Full Stack, com um assistente de IA ("Bruno AI") que responde perguntas sobre minha trajetória, projetos e stack usando RAG.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, lucide-react
- **Chat:** Vercel AI SDK (`ai` + `@ai-sdk/react`), respostas em streaming renderizadas com `react-markdown`
- **RAG (função serverless em `api/chat.ts`):**
  1. Embedding da pergunta com `sentence-transformers/all-MiniLM-L6-v2` (Hugging Face Inference)
  2. Busca vetorial no Pinecone (índice `portfoliorag`, top 5)
  3. Geração com Llama 3.1 8B via Groq
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
| `HF_TOKEN` | Embeddings no Hugging Face Inference |

## Proteções da API de chat

- Validação do corpo: só mensagens `user`/`assistant`; a última precisa ser do usuário.
- Limites: 1000 caracteres por pergunta, 20 mensagens de histórico, 600 tokens de saída.
- Rate limit por IP (10/min, 60/h) em memória. É *best-effort*: em serverless o estado é por instância. Para um limite garantido, use o Firewall da Vercel ou um store como Upstash/Vercel KV.
- Erros sempre em JSON `{ "error": "<mensagem>" }`, sem detalhes internos; o conteúdo das conversas não é logado.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build de produção |
| `npm run lint` | ESLint |
| `npm run preview` | Serve o build localmente |

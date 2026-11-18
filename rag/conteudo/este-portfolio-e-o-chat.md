# Este portfólio e o chat com IA (portfolioV2)

## O que é o portfolioV2

O portfolioV2 é o portfólio pessoal do Bruno Romeu da Silva, este site. Ele apresenta a trajetória, as competências e os projetos do Bruno, permite baixar o currículo em PDF e inclui o "Bruno AI", um chat que responde perguntas sobre o Bruno. O frontend foi feito com React 19, TypeScript, Vite, Tailwind CSS e Motion para as animações. O código é público em github.com/bruno-romeu/portfolioV2 e o deploy é na Vercel.

## Como funciona o chat com RAG do portfólio

O chat do portfólio do Bruno usa RAG (geração aumentada por recuperação). A pergunta vira um embedding gerado localmente na função serverless, com transformers.js e o modelo all-MiniLM-L6-v2, sem API externa. Esse vetor busca os trechos mais parecidos de uma base de conhecimento sobre o Bruno guardada no Pinecone. Os trechos encontrados vão como contexto para o modelo openai/gpt-oss-20b, servido pela Groq, que responde em streaming pelo Vercel AI SDK.

## Cuidados de segurança no chat do portfólio

Bruno incluiu proteções na API do chat do portfólio: validação do corpo da requisição, limite de tamanho por pergunta e de histórico, limite de tokens de saída e rate limit por IP. Os erros voltam em um formato padronizado, sem detalhes internos, e o conteúdo das conversas não é registrado em log. O assistente também é instruído a responder apenas sobre a carreira, os projetos e as habilidades do Bruno.

## Base de conhecimento do chat

A base de conhecimento do chat do Bruno é escrita em arquivos Markdown dentro do repositório, organizados por tema: perfil, experiência, formação, competências, forma de trabalhar com IA, projetos e contato. Um script de ingestão divide os arquivos em trechos, gera os embeddings com o mesmo modelo usado nas perguntas e envia tudo para o Pinecone. Assim a base pode ser revisada e reindexada sempre que o currículo do Bruno mudar.

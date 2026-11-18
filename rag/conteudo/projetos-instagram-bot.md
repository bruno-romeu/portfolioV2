# Projeto de automação de conteúdo para Instagram (Instagram-bot)

## O que faz a automação para Instagram do Bruno

O Instagram-bot é um projeto do Bruno Romeu da Silva que automatiza o conteúdo de uma conta do Instagram. Ele gera e publica carrosséis diários com IA, responde mensagens diretas e comentários e envia cada post gerado para aprovação pelo Telegram antes de publicar. Usa a API oficial da Meta (Graph API) com webhooks em tempo real, o Gemini para gerar texto e classificar os posts em categorias editoriais, e Playwright para renderizar os slides a partir de HTML e CSS.

## Stack e arquitetura do Instagram-bot

O Instagram-bot do Bruno é feito em Python com FastAPI e Uvicorn, persistência assíncrona em PostgreSQL com SQLAlchemy e asyncpg, e migrations com Alembic. A geração diária é coordenada por um agendamento com controle de execução no PostgreSQL, novas tentativas automáticas e histórico auditável. A aplicação roda com Docker e Docker Compose, tem rotas de health e readiness, e o CI no GitHub Actions publica a imagem do container.

## Cuidados de engenharia no Instagram-bot

No Instagram-bot, Bruno tratou problemas reais de integração: as respostas à Meta são enviadas na hora e a IA processa em segundo plano, evitando timeouts e mensagens duplicadas; há proteção contra loop para o bot não responder a si mesmo; a assinatura dos webhooks é validada; e o painel operacional exige autenticação. A configuração é por variáveis de ambiente, com um deploy por conta, e há testes automatizados com pytest, incluindo testes contra PostgreSQL.

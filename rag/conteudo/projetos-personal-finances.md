# Projeto de finanças pessoais via WhatsApp (personal-finances)

## O que faz o bot de finanças pessoais

O personal-finances é um projeto do Bruno Romeu da Silva: um bot para controle financeiro pessoal pelo WhatsApp. O usuário envia mensagens como "despesa 100 mercado" ou "receita 3000 salário", e o bot registra os lançamentos em uma planilha Excel. Um dashboard web mostra o saldo calculado automaticamente, gráficos de gastos por categoria e o histórico de lançamentos. O código está em github.com/bruno-romeu/personal-finances.

## Arquitetura do bot de finanças pessoais

No bot de finanças do Bruno, as mensagens do WhatsApp chegam pela Evolution API a um webhook feito com FastAPI, que grava os dados no Excel com openpyxl e Pandas; o dashboard é feito com Streamlit. A Evolution API roda em Docker Compose com PostgreSQL e Redis, e o Ngrok expõe o webhook publicamente. O projeto mostra o Bruno integrando serviços externos e montando um fluxo completo com Python e Docker.

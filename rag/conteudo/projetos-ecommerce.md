# Projeto de e-commerce completo do Bruno (Django e Next.js)

## O que é o e-commerce desenvolvido pelo Bruno

Bruno Romeu da Silva desenvolveu um e-commerce completo, mantido em um repositório privado em formato de monorepo, com backend, frontend e infraestrutura juntos. A loja cobre o fluxo inteiro de uma venda online: catálogo de produtos, carrinho, contas de clientes, checkout com pagamento, cálculo de frete, pedidos, e-mails transacionais, newsletter e formulário de contato. Por ser privado, o código não aparece no GitHub público do Bruno, mas é um dos projetos mais completos que ele construiu.

## Backend do e-commerce do Bruno (Django e DRF)

O backend do e-commerce do Bruno usa Django 6 com Django REST Framework, PostgreSQL e autenticação com JWT. Os pagamentos são integrados ao Mercado Pago, com webhook de confirmação e uma rotina que concilia pagamentos que ficaram sem pedido. O frete é calculado pela API do Melhor Envio e os e-mails transacionais saem pelo Resend. Tarefas assíncronas rodam com Celery e Redis e com Inngest. O backend tem uma suíte com mais de 700 testes automatizados, que roda no CI.

## Frontend e infraestrutura do e-commerce do Bruno

O frontend do e-commerce do Bruno é feito em Next.js 15 com App Router, TypeScript, Tailwind CSS e shadcn/ui, com formulários validados por React Hook Form e Zod, monitoramento de erros com Sentry e testes com Vitest e Playwright. A infraestrutura usa Docker Compose com Nginx como único serviço exposto, PostgreSQL em rede interna, certificados TLS do Let's Encrypt e backups diários criptografados enviados para armazenamento externo. Nesse projeto Bruno cuidou do produto de ponta a ponta, do modelo de dados ao deploy.

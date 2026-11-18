# Projeto Sinaliza (TCC do Bruno)

## O que é o Sinaliza

O Sinaliza é o TCC do Bruno Romeu da Silva no curso de Análise e Desenvolvimento de Sistemas da ULBRA. É um sistema de apoio ao acompanhamento da trajetória escolar: organiza presença, notas, entregas e observações pedagógicas, identifica mudanças relevantes na trajetória de cada estudante e mostra a evidência que sustenta cada mudança, para que a coordenação decida o próximo passo. Todos os dados do Sinaliza são sintéticos, sem nenhum estudante real.

## O princípio do Sinaliza: evidência em vez de ranking de risco

O Sinaliza, TCC do Bruno, recusa por desenho a ideia de reduzir o estudante a uma probabilidade de evasão. O sistema não calcula nem exibe probabilidade de evasão e não ordena estudantes por risco. Em vez disso, pergunta o que mudou recentemente na trajetória do estudante e por que isso merece atenção. Toda mudança exibida aponta para os registros que a sustentam, e o acompanhamento é um processo conduzido por pessoas.

## Funcionalidades do Sinaliza

No Sinaliza, projeto do Bruno, há lançamentos de presença, notas, entregas e observações pedagógicas; indicadores de trajetória em janela de tempo, com gráfico por período; detecção de mudanças, sinalizadas só quando sinais de eixos diferentes convergem, para reduzir o ruído; lista de evidências de cada mudança; e acompanhamento com registro de ações e ciclo de status. Há também um pipeline experimental de Machine Learning com scikit-learn, mantido fora da interface.

## Stack e arquitetura do Sinaliza

O backend do Sinaliza, TCC do Bruno, usa Python, FastAPI, SQLAlchemy, Alembic e PostgreSQL, organizado em camadas de domínio, aplicação, infraestrutura e apresentação. O frontend usa React, TypeScript, Vite e React Router, com tipos da API gerados a partir do OpenAPI do backend. Os testes usam pytest, Vitest, Testing Library e Playwright. A infraestrutura usa Docker Compose, Nginx e GitHub Actions, com publicação na Azure.

## Documentação e dados do Sinaliza

O Sinaliza, do Bruno, é bem documentado: tem documento de requisitos funcionais e não funcionais, decisões de arquitetura, modelo de dados, avaliação do modelo de Machine Learning e registros de decisão. O dataset sintético é gerado de forma determinística a partir de uma seed, com taxas calibradas pelo Censo Escolar 2023 (INEP). O código é público em github.com/bruno-romeu/sinaliza, sob licença MIT.

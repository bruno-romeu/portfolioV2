# Projeto ETL-ecommerce (Python e Gemini)

## O que faz o ETL-ecommerce

O ETL-ecommerce é um projeto experimental do Bruno Romeu da Silva em Python. O script consome produtos da API DummyJSON, identifica itens com avaliação baixa e envia esses produtos para a API Gemini, que sugere um título otimizado, uma descrição melhor, um preço sugerido e o raciocínio por trás das sugestões. Os dados são atualizados em um dataframe local, simulando a otimização de um catálogo de e-commerce com IA generativa.

## Stack e detalhes do ETL-ecommerce

O ETL-ecommerce, do Bruno, usa Python, Requests, Pandas, o SDK google-genai para a API Gemini e dotenv para a chave de API. Um cuidado do projeto é extrair o JSON da resposta da IA de forma robusta, mesmo quando o modelo envia texto adicional. Como o DummyJSON é uma fonte de dados fake, as alterações não são persistidas. O código está em github.com/bruno-romeu/ETL-ecommerce.

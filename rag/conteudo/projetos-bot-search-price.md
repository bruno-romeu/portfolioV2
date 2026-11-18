# Projeto Bot Comparador de Preços (bot_search_price)

## O que faz o bot comparador de preços

O bot_search_price é um projeto do Bruno Romeu da Silva em Python que automatiza a coleta de preços de produtos em plataformas de venda online e oferece um dashboard para analisar a evolução dos preços. Um bot com Selenium extrai título, preço e link dos produtos, e todas as buscas são salvas em CSV, formando um histórico de preços ao longo do tempo. O código está em github.com/bruno-romeu/bot_search_price.

## Dashboard e stack do bot comparador de preços

O dashboard do bot_search_price, do Bruno, é feito com Streamlit e mostra a variação de preço de cada produto monitorado em um gráfico de linha, com filtros por termo de busca e por período. Os dados são agrupados por dia com Pandas, mostrando o preço médio ou mínimo, e há limpeza automática para tratar valores ausentes e evitar termos de busca duplicados. A stack é Python, Selenium, Pandas, Streamlit e Streamlit Option Menu.

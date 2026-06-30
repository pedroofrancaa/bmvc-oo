# Copa do Mundo 2026 — BMVC Nível 1

Guia visual sobre a Copa do Mundo de 2026 desenvolvido com Bottle/BMVC.
O projeto possui as 48 seleções, calendário com 104 partidas, buscas,
filtros, abas de países-sede, menu responsivo e JavaScript interativo.

As bandeiras são arquivos SVG locais do projeto e a interface utiliza
Inter para textos e Impact para os títulos editoriais.

## Executar localmente

1. Instale o Bottle: `python -m pip install bottle`
2. Execute: `python route.py`
3. Acesse: `http://localhost:8080/copa`

## Executar com Docker

1. `docker build -t bmvc-copa .`
2. `docker run --rm -p 8080:8080 bmvc-copa`

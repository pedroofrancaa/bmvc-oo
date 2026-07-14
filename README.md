# Copa do Mundo 2026 — BMVC

Guia visual sobre a Copa do Mundo de 2026 desenvolvido com Bottle/BMVC.
O projeto possui as 48 seleções, calendário com 104 partidas, buscas,
filtros, abas de países-sede, menu responsivo e JavaScript interativo.

O Nível 2 acrescenta uma área de palpites com modelo Python e CRUD completo
(criar, listar, visualizar, editar e excluir). Os palpites são persistidos
localmente em um banco SQLite criado automaticamente na primeira execução.

O Nível 3 acrescenta controle de acesso de usuários: cadastro e login com
senha em hash (PBKDF2 + salt), sessão via cookie assinado do Bottle, e uma
página de acesso restrito ("Meus palpites") visível apenas para quem está
logado. Criar, editar e excluir palpites agora exige login, e cada palpite
só pode ser editado/excluído pelo usuário que o criou.

As bandeiras são arquivos SVG locais do projeto e a interface utiliza
Inter para textos e Impact para os títulos editoriais.

## Executar localmente

1. Instale o Bottle: `python -m pip install bottle`
2. Execute: `python route.py`
3. Acesse: `http://localhost:8080/copa`

## Rotas principais

- `/copa`: guia da Copa já existente
- `/palpites`: lista de palpites (pública)
- `/palpites/novo`: formulário de cadastro (exige login)
- `/palpites/meus`: área restrita com os palpites do usuário logado
- `/registro`: criação de conta
- `/login` / `/logout`: autenticação

## Executar com Docker

1. `docker build -t bmvc-copa .`
2. `docker run --rm -p 8080:8080 bmvc-copa`

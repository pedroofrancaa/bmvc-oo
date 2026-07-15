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

O Nível 4 transforma a lista pública em um bolão ao vivo. A página abre uma
conexão WebSocket bidirecional com o servidor e recebe imediatamente as
inclusões, edições e exclusões feitas por outros usuários, sem recarregar.
Ela também mostra o estado da conexão, o número de pessoas acompanhando e
notificações das alterações. Em caso de queda, o navegador tenta reconectar
automaticamente.

As bandeiras são arquivos SVG locais do projeto e a interface utiliza
Inter para textos e Impact para os títulos editoriais.

## Executar localmente

1. Instale as dependências: `python -m pip install -r requirements.txt`
2. Execute: `python route.py`
3. Acesse: `http://localhost:8080/copa`

## Rotas principais

- `/copa`: guia da Copa já existente
- `/palpites`: lista de palpites (pública)
- `/palpites/dados`: estado atual do bolão em JSON
- `/ws/palpites`: conexão WebSocket do bolão ao vivo
- `/palpites/novo`: formulário de cadastro (exige login)
- `/palpites/meus`: área restrita com os palpites do usuário logado
- `/registro`: criação de conta
- `/login` / `/logout`: autenticação

## Executar com Docker

1. `docker build -t bmvc-copa .`
2. `docker run --rm -p 8080:8080 bmvc-copa`

## Como demonstrar o Nível 4

1. Abra `/palpites` em dois navegadores ou em uma janela normal e outra anônima.
2. Faça login em uma das janelas e mantenha a lista pública aberta na outra.
3. Crie, edite e exclua um palpite.
4. Mostre que a segunda janela atualiza os cards, o total e a notificação sem
   qualquer recarregamento manual.
5. Mostre o indicador "Ao vivo" e a contagem de pessoas conectadas.

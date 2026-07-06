<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Palpite #{{palpite['id']}} | Copa 2026</title>
    <link rel="stylesheet" href="/static/css/palpites.css?v=6">
    <script src="/static/js/palpites.js?v=6" defer></script>
</head>
<body>
    <div class="faixa-superior">
        <p>COPA DO MUNDO 2026</p>
        <p>CANADÁ · MÉXICO · ESTADOS UNIDOS</p>
    </div>
    <header class="cabecalho">
        <a class="marca" href="/copa" aria-label="Início Copa do Mundo 2026">COPA DO MUNDO 2026</a>
        <button class="menu-botao" type="button" aria-expanded="false" aria-controls="menu">
            <span></span><span></span>
            <span class="visualmente-oculto">Abrir menu</span>
        </button>
        <nav id="menu" aria-label="Navegação principal">
            <a href="/copa#agora">Agora</a>
            <a href="/copa#selecoes">48 seleções</a>
            <a href="/copa#jogos">104 jogos</a>
            <a href="/copa#sedes">Sedes</a>
            <a class="ativo" href="/palpites">Palpites</a>
            <a class="nav-novo-palpite" href="/palpites/novo">Novo palpite →</a>
        </nav>
        <a class="botao botao-destaque cabecalho-cta" href="/palpites/novo">
            Novo palpite <span aria-hidden="true">→</span>
        </a>
    </header>

    <main class="pagina-detalhe">
        % if palpite.get('mensagem'):
        <div class="mensagem" role="status">{{palpite['mensagem']}}</div>
        % end

        <article class="detalhe">
            <div class="card-meta">
                <span>JOGO {{str(palpite['partida_numero']).zfill(3)}}</span>
                <span>PALPITE #{{str(palpite['id']).zfill(3)}}</span>
            </div>
            <p class="rotulo">PALPITE DE {{palpite['participante'].upper()}}</p>
            <div class="placar placar-grande">
                <strong>{{palpite['mandante']}}</strong>
                <b>{{palpite['gols_mandante']}} <i>×</i> {{palpite['gols_visitante']}}</b>
                <strong>{{palpite['visitante']}}</strong>
            </div>
            <p class="data-registro">Enviado em {{palpite['criado_em_formatado']}}</p>
            <div class="acoes-detalhe">
                <a href="/palpites">← Todos os palpites</a>
                <a class="botao botao-escuro" href="/palpites/{{palpite['id']}}/editar">Editar palpite</a>
                <form action="/palpites/{{palpite['id']}}/excluir" method="post" data-form-excluir>
                    <button class="botao botao-perigo" type="submit">Excluir</button>
                </form>
            </div>
        </article>
    </main>
</body>
</html>

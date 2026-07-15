<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Área restrita com os palpites cadastrados pela sua conta.">
    <title>Meus palpites | Copa do Mundo 2026</title>
    <link rel="stylesheet" href="/static/css/palpites.css?v=10">
    <script src="/static/js/palpites.js?v=7" defer></script>
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
            <a href="/palpites">Palpites</a>
            <a class="ativo" href="/palpites/meus">Meus palpites</a>
            <a class="nav-novo-palpite" href="/palpites/novo">Novo palpite →</a>
            <form class="nav-sair" action="/logout" method="post"><button type="submit">Sair ({{usuario['nome']}})</button></form>
        </nav>
        <a class="botao botao-destaque cabecalho-cta" href="/palpites/novo">
            Novo palpite <span aria-hidden="true">→</span>
        </a>
    </header>

    <main>
        <section class="cabecalho-pagina">
            <div>
                <p class="rotulo">ÁREA RESTRITA</p>
                <h1>Meus<br>palpites.</h1>
            </div>
            <p>Só você vê e gerencia esta lista: {{usuario['nome']}}, conta {{usuario['login']}}.</p>
        </section>

        % if mensagem:
        <div class="mensagem" role="status">{{mensagem}}</div>
        % end

        <section class="conteudo" aria-labelledby="titulo-lista">
            <div class="titulo-lista">
                <div>
                    <p class="rotulo">CONTA {{usuario['login'].upper()}}</p>
                    <h2 id="titulo-lista">Seus palpites</h2>
                </div>
                <span>{{len(palpites)}} palpite{{'' if len(palpites) == 1 else 's'}}</span>
            </div>

            % if palpites:
            <div class="grade-palpites">
                % for palpite in palpites:
                <article class="card-palpite">
                    <div class="card-meta">
                        <span>JOGO {{str(palpite['partida_numero']).zfill(3)}}</span>
                        <span>PALPITE #{{str(palpite['id']).zfill(3)}}</span>
                    </div>
                    % if palpite.get('contexto'):
                    <p class="contexto-partida">{{palpite['contexto']}}{{' · ' + palpite['sede'] if palpite.get('sede') else ''}}</p>
                    % end
                    <div class="placar">
                        <strong>{{palpite['mandante']}}</strong>
                        <b>{{palpite['gols_mandante']}} <i>×</i> {{palpite['gols_visitante']}}</b>
                        <strong>{{palpite['visitante']}}</strong>
                    </div>

                    <div class="participantes-grupo">
                        <div class="participante-linha">
                            <a class="participante-nome" href="/palpites/{{palpite['id']}}">Ver detalhes</a>
                            <div class="participante-acoes">
                                <a href="/palpites/{{palpite['id']}}/editar">Editar</a>
                                <form action="/palpites/{{palpite['id']}}/excluir" method="post" data-form-excluir>
                                    <button type="submit">Excluir</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </article>
                % end
            </div>
            % else:
            <div class="vazio">
                <span>0 × 0</span>
                <h3>Você ainda não fez nenhum palpite.</h3>
                <p>Escolha um confronto e arrisque o placar.</p>
                <a class="botao botao-escuro" href="/palpites/novo">Criar meu primeiro palpite</a>
            </div>
            % end
        </section>
    </main>

    <footer>
        <span>COPA DO MUNDO 2026</span>
        <p>O bolão de quem acompanha cada jogo.</p>
    </footer>
</body>
</html>

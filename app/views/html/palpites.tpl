<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Palpites dos torcedores para os jogos da Copa do Mundo de 2026.">
    <title>Palpites | Copa do Mundo 2026</title>
    <link rel="stylesheet" href="/static/css/palpites.css?v=10">
    <script src="/static/js/palpites.js?v=7" defer></script>
</head>
<body data-usuario-id="{{usuario['id'] if usuario else ''}}">
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
            % if usuario:
            <a href="/palpites/meus">Meus palpites</a>
            <a class="nav-novo-palpite" href="/palpites/novo">Novo palpite →</a>
            <form class="nav-sair" action="/logout" method="post"><button type="submit">Sair ({{usuario['nome']}})</button></form>
            % else:
            <a href="/login">Entrar</a>
            <a class="nav-novo-palpite" href="/registro">Cadastrar →</a>
            % end
        </nav>
        % if usuario:
        <a class="botao botao-destaque cabecalho-cta" href="/palpites/novo">
            Novo palpite <span aria-hidden="true">→</span>
        </a>
        % else:
        <a class="botao botao-destaque cabecalho-cta" href="/login">
            Entrar para palpitar <span aria-hidden="true">→</span>
        </a>
        % end
    </header>

    <main>
        <section class="cabecalho-pagina">
            <div>
                <p class="rotulo">BOLÃO DA TORCIDA</p>
                <h1>Seus palpites.<br>Seu jogo.</h1>
            </div>
            <p>Escolha uma partida, arrisque o placar e veja os palpites da torcida.</p>
        </section>

        % if mensagem:
        <div class="mensagem" role="status">{{mensagem}}</div>
        % end

        <section class="conteudo" aria-labelledby="titulo-lista">
            <div class="painel-tempo-real" data-painel-tempo-real>
                <div class="status-tempo-real desconectado" id="status-tempo-real">
                    <span aria-hidden="true"></span>
                    <strong>Conectando ao vivo...</strong>
                </div>
                <p><strong id="usuarios-online">0</strong> acompanhando agora</p>
            </div>
            <div class="aviso-tempo-real" id="aviso-tempo-real" role="status" aria-live="polite" hidden></div>

            <div class="titulo-lista">
                <div>
                    <p class="rotulo">BOLÃO DA TORCIDA</p>
                    <h2 id="titulo-lista">Todos os palpites</h2>
                </div>
                <span id="total-palpites">{{total_palpites}} palpite{{'' if total_palpites == 1 else 's'}}</span>
            </div>

            <div id="lista-palpites" class="lista-palpites" aria-live="polite">
            % if grupos:
            <div class="grade-palpites">
                % for grupo in grupos:
                <article class="card-palpite">
                    <div class="card-meta">
                        <span>JOGO {{str(grupo['partida_numero']).zfill(3)}}</span>
                        <span>{{len(grupo['participantes'])}} {{'PALPITE' if len(grupo['participantes']) == 1 else 'PALPITES'}}</span>
                    </div>
                    % if grupo.get('contexto'):
                    <p class="contexto-partida">{{grupo['contexto']}}{{' · ' + grupo['sede'] if grupo.get('sede') else ''}}</p>
                    % end
                    <div class="placar">
                        <strong>{{grupo['mandante']}}</strong>
                        <b>{{grupo['gols_mandante']}} <i>×</i> {{grupo['gols_visitante']}}</b>
                        <strong>{{grupo['visitante']}}</strong>
                    </div>

                    <div class="participantes-grupo">
                        <p>{{'QUEM FEZ ESTE PALPITE' if len(grupo['participantes']) == 1 else 'QUEM FEZ ESTE MESMO PALPITE'}}</p>
                        % for palpite in grupo['participantes']:
                        <div class="participante-linha">
                            <a class="participante-nome" href="/palpites/{{palpite['id']}}">
                                {{palpite['participante']}}
                            </a>
                            <div class="participante-acoes">
                                <a href="/palpites/{{palpite['id']}}">Ver</a>
                                % if usuario and usuario['id'] == palpite.get('usuario_id'):
                                <a href="/palpites/{{palpite['id']}}/editar">Editar</a>
                                <form action="/palpites/{{palpite['id']}}/excluir" method="post" data-form-excluir>
                                    <button type="submit">Excluir</button>
                                </form>
                                % end
                            </div>
                        </div>
                        % end
                    </div>
                </article>
                % end
            </div>
            % else:
            <div class="vazio">
                <span>0 × 0</span>
                <h3>Ainda não há palpites.</h3>
                <p>Cadastre o primeiro placar para começar o bolão.</p>
                <a class="botao botao-escuro" href="{{'/palpites/novo' if usuario else '/login'}}">Criar primeiro palpite</a>
            </div>
            % end
            </div>
        </section>
    </main>

    <footer>
        <span>COPA DO MUNDO 2026</span>
        <p>O bolão de quem acompanha cada jogo.</p>
    </footer>
</body>
</html>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{'Editar' if palpite.get('id') else 'Novo'}} palpite | Copa 2026</title>
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
            <a href="/palpites/meus">Meus palpites</a>
            <a class="nav-novo-palpite" href="/palpites/novo">Novo palpite →</a>
            <form class="nav-sair" action="/logout" method="post"><button type="submit">Sair ({{usuario['nome']}})</button></form>
        </nav>
        <a class="botao botao-destaque cabecalho-cta" href="/palpites/novo">
            Novo palpite <span aria-hidden="true">→</span>
        </a>
    </header>

    <main>
        <section class="cabecalho-formulario">
            <div>
                <p class="rotulo">{{'ATUALIZAR PALPITE' if palpite.get('id') else 'BOLÃO DA TORCIDA'}}</p>
                <h1>{{'Ajuste seu placar.' if palpite.get('id') else 'Faça seu palpite.'}}</h1>
            </div>
            <p>Escolha o confronto, arrisque o resultado e entre no clima da Copa do Mundo 2026.</p>
        </section>

        <section class="formulario-area">
            % if erro:
            <div class="mensagem erro" role="alert">{{erro}}</div>
            % end

            <form class="formulario" method="post">
                <div class="formulario-bloco">
                    <div class="bloco-titulo">
                        <span>01</span>
                        <div>
                            <h2>Quem está palpitando?</h2>
                            <p>O palpite fica associado à sua conta logada.</p>
                        </div>
                    </div>
                    <p class="participante-logado">Palpitando como <strong>{{usuario['nome']}}</strong></p>
                </div>

                <div class="formulario-bloco">
                    <div class="bloco-titulo">
                        <span>02</span>
                        <div>
                            <h2>Escolha o confronto</h2>
                            <p>Selecione uma das próximas partidas do torneio.</p>
                        </div>
                    </div>
                    <label>
                        <span>Partida</span>
                        <select name="partida_numero" id="partida" required>
                            <option value="">Selecione uma partida</option>
                            % for partida in partidas:
                            % mandante_exibicao = partida.get('mandante_exibicao', partida['mandante']).replace('Vencedor ', 'Vencedor do jogo ', 1).replace('Perdedor ', 'Perdedor do jogo ', 1)
                            % visitante_exibicao = partida.get('visitante_exibicao', partida['visitante']).replace('Vencedor ', 'Vencedor do jogo ', 1).replace('Perdedor ', 'Perdedor do jogo ', 1)
                            <option
                                value="{{partida['numero']}}"
                                data-mandante="{{mandante_exibicao}}"
                                data-visitante="{{visitante_exibicao}}"
                                data-mandante-indefinido="{{'1' if partida.get('mandante_indefinido', partida['mandante'].startswith(('Vencedor ', 'Perdedor '))) else ''}}"
                                data-visitante-indefinido="{{'1' if partida.get('visitante_indefinido', partida['visitante'].startswith(('Vencedor ', 'Perdedor '))) else ''}}"
                                data-fase="{{partida.get('fase', '')}}"
                                data-sede="{{partida.get('sede', '')}}"
                                {{'selected' if str(palpite.get('partida_numero', '')) == str(partida['numero']) else ''}}
                            >
                                Jogo {{str(partida['numero']).zfill(3)}} — {{mandante_exibicao}} × {{visitante_exibicao}}
                            </option>
                            % end
                        </select>
                        <small class="dica-partida" id="dica-partida" hidden></small>
                    </label>
                </div>

                <div class="formulario-bloco formulario-bloco-placar">
                    <div class="bloco-titulo">
                        <span>03</span>
                        <div>
                            <h2>Qual será o placar?</h2>
                            <p>Agora é com você: escolha o resultado da partida.</p>
                        </div>
                    </div>
                    <fieldset>
                        <legend class="visualmente-oculto">Confronto e placar previstos</legend>
                        <p class="placar-vazio" id="placar-vazio">Escolha uma partida para preencher o placar.</p>
                        <div class="campos-placar" id="campos-placar" hidden>
                            <label class="campo-time">
                                <span id="rotulo-mandante">Primeira seleção</span>
                                <select class="seletor-time" name="mandante" id="seletor-mandante" hidden>
                                    <option value="">Escolha a seleção</option>
                                    % for selecao in selecoes_vivas:
                                    <option value="{{selecao}}" {{'selected' if palpite.get('mandante') == selecao else ''}}>{{selecao}}</option>
                                    % end
                                </select>
                                <input type="number" name="gols_mandante" aria-label="Gols da primeira seleção"
                                       value="{{palpite.get('gols_mandante', '')}}" min="0" max="99" required>
                            </label>
                            <b>×</b>
                            <label class="campo-time">
                                <span id="rotulo-visitante">Segunda seleção</span>
                                <select class="seletor-time" name="visitante" id="seletor-visitante" hidden>
                                    <option value="">Escolha a seleção</option>
                                    % for selecao in selecoes_vivas:
                                    <option value="{{selecao}}" {{'selected' if palpite.get('visitante') == selecao else ''}}>{{selecao}}</option>
                                    % end
                                </select>
                                <input type="number" name="gols_visitante" aria-label="Gols da segunda seleção"
                                       value="{{palpite.get('gols_visitante', '')}}" min="0" max="99" required>
                            </label>
                        </div>
                    </fieldset>
                </div>

                <div class="acoes-formulario">
                    <a href="{{'/palpites/' + str(palpite['id']) if palpite.get('id') else '/palpites'}}">← Cancelar e voltar</a>
                    <button class="botao botao-destaque" type="submit">
                        {{'Salvar alterações' if palpite.get('id') else 'Cadastrar palpite'}}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </form>
        </section>
    </main>
</body>
</html>

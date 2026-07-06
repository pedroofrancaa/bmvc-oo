<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Painel completo e atualizado da Copa do Mundo de 2026.">
    <title>Copa do Mundo 2026 | Jogos, seleções e resultados</title>
    <link rel="stylesheet" href="/static/css/copa.css?v=8">
    <script src="/static/js/copa.js?v=8" defer></script>
</head>
<body>
    <div class="faixa-superior">
        <p>ATUALIZADO EM 05 JUL 2026 · 20H09 BRT</p>
        <p>CANADÁ · MÉXICO · ESTADOS UNIDOS</p>
    </div>

    <header class="cabecalho">
        <a class="marca" href="/copa" aria-label="Início Copa do Mundo 2026">
            <span>COPA DO MUNDO 2026</span>
        </a>
        <button class="menu-botao" id="menu-botao" type="button" aria-expanded="false" aria-controls="menu">
            <span></span><span></span>
            <span class="visualmente-oculto">Abrir menu</span>
        </button>
        <nav id="menu" aria-label="Navegação principal">
            <a href="#agora">Agora</a>
            <a href="#selecoes">48 seleções</a>
            <a href="#jogos">104 jogos</a>
            <a href="#sedes">Sedes</a>
            <a class="nav-palpites" href="/palpites">Palpites</a>
        </nav>
        <a class="botao-preto cabecalho-cta" href="/palpites">Palpites <span aria-hidden="true">→</span></a>
    </header>

    <main>
        <section class="hero" aria-labelledby="titulo-principal">
            <img src="/static/img/copa-hero.png?v=6" alt="Jogadores disputando a bola durante uma partida em estádio lotado" fetchpriority="high">
            <div class="hero-sombra"></div>
            <div class="hero-conteudo">
                <span class="selo-ao-vivo"><i></i> OITAVAS DE FINAL</span>
                <h1 id="titulo-principal">GUIA DA<br>COPA 2026.</h1>
                <p>Resultados, 48 seleções e o calendário completo das 104 partidas em um só lugar.</p>
                <a class="botao-branco" href="#agora">Ver status atual <span aria-hidden="true">↓</span></a>
            </div>
        </section>

        <section class="agora" id="agora" aria-labelledby="titulo-agora">
            <div class="agora-cabecalho">
                <div>
                    <p class="rotulo">STATUS EM 05 DE JULHO</p>
                    <h2 id="titulo-agora">A Copa agora</h2>
                </div>
                <span class="atualizacao">Atualizado às 20h09 BRT</span>
            </div>

            <div class="destaques-agora">
                <article class="placar-destaque brasil-placar">
                    <div class="placar-meta"><span>ENCERRADO</span><span>PARTIDA 91</span></div>
                    <p>OITAVAS DE FINAL · NOVA YORK/NOVA JERSEY</p>
                    <div class="placar-times">
                        <strong><img src="/static/img/flags/br.svg" alt=""> Brasil</strong>
                        <b>1 — 2</b>
                        <strong>Noruega <img src="/static/img/flags/no.svg" alt=""></strong>
                    </div>
                    <small>Brasil eliminado nas oitavas de final.</small>
                </article>

                <div class="status-lateral">
                    <article>
                        <span class="status-numero">03</span>
                        <div><b>NAS QUARTAS</b><p>França, Países Baixos e Noruega já avançaram.</p></div>
                    </article>
                    <article>
                        <span class="status-numero">01</span>
                        <div><b>JOGO HOJE</b><p>México x Inglaterra fecha as oitavas.</p></div>
                    </article>
                    <article>
                        <span class="status-numero">14</span>
                        <div><b>JOGOS RESTANTES</b><p>Incluindo a decisão em 19 de julho.</p></div>
                    </article>
                </div>
            </div>

            <div class="jogos-hoje">
                <div class="jogos-hoje-titulo">
                    <h3>Jogos de hoje</h3>
                    <span>Horários de Brasília</span>
                </div>
                <div class="hoje-grade">
                    <article><span>ENCERRADO</span><b><span><img src="/static/img/flags/br.svg" alt=""> Brasil</span><em>1–2</em><span>Noruega <img src="/static/img/flags/no.svg" alt=""></span></b><p>Nova York/Nova Jersey</p></article>
                    <article><span>22H00</span><b><span><img src="/static/img/flags/mx.svg" alt=""> México</span><em>×</em><span>Inglaterra <img src="/static/img/flags/gb-eng.svg" alt=""></span></b><p>Cidade do México</p></article>
                </div>
            </div>
        </section>

        <section class="secao selecoes" id="selecoes" aria-labelledby="titulo-selecoes">
            <div class="secao-cabecalho">
                <div>
                    <p class="rotulo">TODAS AS NAÇÕES</p>
                    <h2 id="titulo-selecoes">As 48 seleções</h2>
                </div>
                <p class="secao-descricao">
                    Consulte os 12 grupos e veja quem segue vivo. Use a busca ou filtre pela situação atual.
                </p>
            </div>

            <div class="controles">
                <label class="busca">
                    <span aria-hidden="true">⌕</span>
                    <span class="visualmente-oculto">Buscar seleção</span>
                    <input id="busca-selecao" type="search" placeholder="Buscar seleção..." autocomplete="off">
                </label>
                <div class="filtros" role="group" aria-label="Filtrar seleções">
                    <button class="filtro ativo" type="button" data-equipe-filtro="todas">Todas</button>
                    <button class="filtro" type="button" data-equipe-filtro="vivas">Na disputa</button>
                    <button class="filtro" type="button" data-equipe-filtro="eliminadas">Eliminadas</button>
                </div>
            </div>

            <div class="grade-equipes" id="grade-equipes" aria-live="polite"></div>
            <p class="resultado-contagem" id="contagem-equipes"></p>
        </section>

        <section class="secao calendario" id="jogos" aria-labelledby="titulo-jogos">
            <div class="secao-cabecalho">
                <div>
                    <p class="rotulo">DO JOGO 1 À FINAL</p>
                    <h2 id="titulo-jogos">Os 104 jogos</h2>
                </div>
                <p class="secao-descricao">
                    Resultados da fase de grupos e caminho completo até a final. Horários ET quando confirmados.
                </p>
            </div>

            <div class="controles controles-jogos">
                <label class="busca">
                    <span aria-hidden="true">⌕</span>
                    <span class="visualmente-oculto">Buscar partida por seleção ou sede</span>
                    <input id="busca-jogo" type="search" placeholder="Buscar time ou cidade..." autocomplete="off">
                </label>
                <div class="filtros filtros-fases" role="group" aria-label="Filtrar partidas por fase">
                    <button class="filtro ativo" type="button" data-fase="todas">Todos</button>
                    <button class="filtro" type="button" data-fase="grupos">Grupos</button>
                    <button class="filtro" type="button" data-fase="32">Fase de 32</button>
                    <button class="filtro" type="button" data-fase="16">Oitavas</button>
                    <button class="filtro" type="button" data-fase="quartas">Quartas</button>
                    <button class="filtro" type="button" data-fase="semi">Semifinais</button>
                    <button class="filtro" type="button" data-fase="finais">Finais</button>
                </div>
            </div>

            <div class="calendario-resumo">
                <p><strong id="contagem-jogos">104</strong> partidas exibidas</p>
                <div><i class="legenda encerrado"></i> Encerrado <i class="legenda hoje"></i> Hoje <i class="legenda proximo"></i> Próximo</div>
            </div>
            <div class="lista-jogos" id="lista-jogos" aria-live="polite"></div>
        </section>

        <section class="secao sedes" id="sedes">
            <div class="secao-cabecalho">
                <div>
                    <p class="rotulo">TRÊS PAÍSES, 16 CIDADES</p>
                    <h2>Palcos do Mundial</h2>
                </div>
            </div>
            <div class="abas" role="tablist" aria-label="Países-sede">
                <button class="aba ativa" type="button" role="tab" aria-selected="true" data-pais="mexico">México</button>
                <button class="aba" type="button" role="tab" aria-selected="false" data-pais="canada">Canadá</button>
                <button class="aba" type="button" role="tab" aria-selected="false" data-pais="eua">Estados Unidos</button>
            </div>
            <div class="sede-painel" id="painel-sede" role="tabpanel" aria-live="polite">
                <div>
                    <p id="sede-indice">01 / MÉXICO</p>
                    <h3 id="sede-titulo">Onde tudo começou.</h3>
                    <p id="sede-texto">Cidade do México recebeu a abertura. Guadalajara e Monterrey completam as sedes mexicanas.</p>
                </div>
                <span class="sede-sigla" id="sede-sigla" aria-hidden="true">MEX</span>
            </div>
        </section>
    </main>

    <footer>
        <a class="marca" href="/copa"><span>COPA DO MUNDO 2026</span></a>
        <p>Calendário e resultados: <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums" target="_blank" rel="noopener">FIFA</a> · Guia independente.</p>
        <a href="#titulo-principal">Voltar ao topo ↑</a>
    </footer>
</body>
</html>

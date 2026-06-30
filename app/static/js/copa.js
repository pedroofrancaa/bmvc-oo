document.addEventListener("DOMContentLoaded", () => {
    const { equipes, partidas } = window.COPA_DADOS;

    const menuBotao = document.querySelector("#menu-botao");
    const menu = document.querySelector("#menu");

    menuBotao.addEventListener("click", () => {
        const aberto = menu.classList.toggle("aberto");
        menuBotao.setAttribute("aria-expanded", String(aberto));
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("aberto");
            menuBotao.setAttribute("aria-expanded", "false");
        });
    });

    const nomesSituacao = {
        classificada: "Nas oitavas",
        oitavas: "Na disputa",
        "eliminada-oitavas": "Eliminada nas oitavas de 32",
        "eliminada-grupos": "Eliminada na fase de grupos"
    };

    const gradeEquipes = document.querySelector("#grade-equipes");
    const buscaSelecao = document.querySelector("#busca-selecao");
    const filtrosEquipes = document.querySelectorAll("[data-equipe-filtro]");
    const contagemEquipes = document.querySelector("#contagem-equipes");
    let filtroEquipe = "todas";

    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function renderizarEquipes() {
        const termo = normalizar(buscaSelecao.value.trim());
        const filtradas = equipes.filter((equipe) => {
            const eliminada = equipe.situacao.startsWith("eliminada");
            const correspondeFiltro =
                filtroEquipe === "todas" ||
                (filtroEquipe === "vivas" && !eliminada) ||
                (filtroEquipe === "eliminadas" && eliminada);
            const correspondeBusca = normalizar(`${equipe.nome} ${equipe.codigo} ${equipe.grupo}`).includes(termo);
            return correspondeFiltro && correspondeBusca;
        });

        gradeEquipes.innerHTML = "";
        filtradas.forEach((equipe) => {
            const eliminada = equipe.situacao.startsWith("eliminada");
            const artigo = document.createElement("article");
            artigo.className = `equipe-card${eliminada ? " equipe-eliminada" : ""}`;
            artigo.innerHTML = `
                <div class="equipe-topo">
                    <img class="equipe-bandeira" src="/static/img/flags/${equipe.bandeiraSvg}.svg" alt="Bandeira de ${equipe.nome}">
                    <span class="equipe-grupo">GRUPO ${equipe.grupo}</span>
                </div>
                <strong>${equipe.nome}</strong>
                <div class="equipe-rodape">
                    <span>${equipe.codigo}</span>
                    <span class="situacao ${eliminada ? "fora" : "viva"}">${nomesSituacao[equipe.situacao]}</span>
                </div>
            `;
            gradeEquipes.appendChild(artigo);
        });

        contagemEquipes.textContent = `${filtradas.length} de 48 seleções exibidas`;
    }

    filtrosEquipes.forEach((botao) => {
        botao.addEventListener("click", () => {
            filtroEquipe = botao.dataset.equipeFiltro;
            filtrosEquipes.forEach((item) => item.classList.remove("ativo"));
            botao.classList.add("ativo");
            renderizarEquipes();
        });
    });
    buscaSelecao.addEventListener("input", renderizarEquipes);

    const nomesFase = {
        grupos: "Fase de grupos",
        32: "Fase de 32",
        16: "Oitavas de final",
        quartas: "Quartas de final",
        semi: "Semifinal",
        finais: "Decisão"
    };

    const listaJogos = document.querySelector("#lista-jogos");
    const buscaJogo = document.querySelector("#busca-jogo");
    const filtrosFase = document.querySelectorAll("[data-fase]");
    const contagemJogos = document.querySelector("#contagem-jogos");
    let filtroFase = "todas";

    function formatarData(dataIso) {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short"
        }).format(new Date(`${dataIso}T12:00:00`)).replace(".", "").toUpperCase();
    }

    function renderizarJogos() {
        const termo = normalizar(buscaJogo.value.trim());
        const filtradas = partidas.filter((partida) => {
            const correspondeFase = filtroFase === "todas" || partida.fase === filtroFase;
            const correspondeBusca = normalizar(
                `${partida.mandante} ${partida.visitante} ${partida.sede} ${partida.grupo}`
            ).includes(termo);
            return correspondeFase && correspondeBusca;
        });

        listaJogos.innerHTML = "";
        filtradas.forEach((partida) => {
            const card = document.createElement("article");
            const placar = partida.placar || "×";
            const complementoFase = partida.grupo ? ` · GRUPO ${partida.grupo}` : "";
            card.className = `jogo-card jogo-${partida.status}`;
            card.innerHTML = `
                <div class="jogo-meta">
                    <span>JOGO ${String(partida.numero).padStart(3, "0")}</span>
                    <span>${formatarData(partida.data)}${partida.horario ? ` · ${partida.horario}` : ""}</span>
                </div>
                <p>${nomesFase[partida.fase]}${complementoFase}</p>
                <div class="jogo-confronto">
                    <strong>${partida.mandante}</strong>
                    <b>${placar}</b>
                    <strong>${partida.visitante}</strong>
                </div>
                <div class="jogo-local">
                    <span>${partida.sede}</span>
                    <span class="estado-jogo">${partida.status === "encerrado" ? "Encerrado" : partida.status === "hoje" ? "Hoje" : "Agendado"}</span>
                </div>
            `;
            listaJogos.appendChild(card);
        });

        contagemJogos.textContent = filtradas.length;
    }

    filtrosFase.forEach((botao) => {
        botao.addEventListener("click", () => {
            filtroFase = botao.dataset.fase;
            filtrosFase.forEach((item) => item.classList.remove("ativo"));
            botao.classList.add("ativo");
            renderizarJogos();
        });
    });
    buscaJogo.addEventListener("input", renderizarJogos);

    const dadosSedes = {
        mexico: {
            indice: "01 / MÉXICO",
            titulo: "Onde tudo começou.",
            texto: "Cidade do México recebeu a abertura. Guadalajara e Monterrey completam as sedes mexicanas.",
            sigla: "MEX"
        },
        canada: {
            indice: "02 / CANADÁ",
            titulo: "Duas cidades ao norte.",
            texto: "Toronto e Vancouver representam o Canadá e conectam as costas leste e oeste ao torneio.",
            sigla: "CAN"
        },
        eua: {
            indice: "03 / ESTADOS UNIDOS",
            titulo: "Onze cidades em campo.",
            texto: "De Los Angeles a Nova York/Nova Jersey, o país recebe a maior parte dos jogos e a final.",
            sigla: "USA"
        }
    };

    const abas = document.querySelectorAll(".aba");
    const sedeIndice = document.querySelector("#sede-indice");
    const sedeTitulo = document.querySelector("#sede-titulo");
    const sedeTexto = document.querySelector("#sede-texto");
    const sedeSigla = document.querySelector("#sede-sigla");

    abas.forEach((aba) => {
        aba.addEventListener("click", () => {
            const dados = dadosSedes[aba.dataset.pais];
            abas.forEach((item) => {
                item.classList.remove("ativa");
                item.setAttribute("aria-selected", "false");
            });
            aba.classList.add("ativa");
            aba.setAttribute("aria-selected", "true");
            sedeIndice.textContent = dados.indice;
            sedeTitulo.textContent = dados.titulo;
            sedeTexto.textContent = dados.texto;
            sedeSigla.textContent = dados.sigla;
        });
    });

    renderizarEquipes();
    renderizarJogos();
});

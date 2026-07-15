document.addEventListener("DOMContentLoaded", () => {
    const menuBotao = document.querySelector(".menu-botao");
    const menu = document.querySelector("#menu");

    menuBotao?.addEventListener("click", () => {
        const aberto = menu.classList.toggle("aberto");
        menuBotao.setAttribute("aria-expanded", String(aberto));
    });

    menu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("aberto");
            menuBotao?.setAttribute("aria-expanded", "false");
        });
    });

    const seletorPartida = document.querySelector("#partida");
    const dicaPartida = document.querySelector("#dica-partida");
    const camposPlacar = document.querySelector("#campos-placar");
    const placarVazio = document.querySelector("#placar-vazio");

    const nomesFase = {
        grupos: "Fase de grupos",
        "32": "Fase de 32",
        "16": "Oitavas de final",
        quartas: "Quartas de final",
        semi: "Semifinal",
        finais: "Decisão"
    };

    function configurarLado(posicao, nomeTime, indefinido) {
        const rotulo = document.querySelector(`#rotulo-${posicao}`);
        const seletor = document.querySelector(`#seletor-${posicao}`);
        if (!rotulo || !seletor) return;

        if (indefinido) {
            rotulo.textContent = `Quem avança? · ${nomeTime}`;
            seletor.hidden = false;
            seletor.required = true;
        } else {
            rotulo.textContent = nomeTime || (posicao === "mandante" ? "Primeira seleção" : "Segunda seleção");
            seletor.hidden = true;
            seletor.required = false;
            seletor.value = "";
        }
    }

    function atualizarTimes() {
        if (!seletorPartida) return;
        const opcao = seletorPartida.selectedOptions[0];
        const dados = opcao?.dataset || {};
        const partidaSelecionada = Boolean(seletorPartida.value);

        if (camposPlacar) camposPlacar.hidden = !partidaSelecionada;
        if (placarVazio) placarVazio.hidden = partidaSelecionada;

        configurarLado("mandante", dados.mandante, dados.mandanteIndefinido === "1");
        configurarLado("visitante", dados.visitante, dados.visitanteIndefinido === "1");

        if (dicaPartida) {
            if (dados.fase && dados.sede) {
                const fase = nomesFase[dados.fase] || dados.fase;
                dicaPartida.textContent = `${fase} · ${dados.sede}`;
                dicaPartida.hidden = false;
            } else {
                dicaPartida.hidden = true;
            }
        }
    }

    seletorPartida?.addEventListener("change", atualizarTimes);
    atualizarTimes();

    document.addEventListener("submit", (evento) => {
        if (evento.target.matches("[data-form-excluir]")) {
            const confirmou = window.confirm(
                "Tem certeza que deseja excluir este palpite? Esta ação não pode ser desfeita."
            );
            if (!confirmou) evento.preventDefault();
        }
    });

    const mensagem = document.querySelector(".mensagem:not(.erro)");
    if (mensagem) {
        window.setTimeout(() => mensagem.classList.add("oculta"), 4000);
    }

    const painelTempoReal = document.querySelector("[data-painel-tempo-real]");
    if (!painelTempoReal) return;

    const statusTempoReal = document.querySelector("#status-tempo-real");
    const textoStatus = statusTempoReal?.querySelector("strong");
    const usuariosOnline = document.querySelector("#usuarios-online");
    const totalPalpites = document.querySelector("#total-palpites");
    const listaPalpites = document.querySelector("#lista-palpites");
    const avisoTempoReal = document.querySelector("#aviso-tempo-real");
    const usuarioId = Number(document.body.dataset.usuarioId) || null;
    let websocket;
    let temporizadorReconexao;
    let temporizadorAviso;
    let paginaEncerrada = false;

    function elemento(tag, classe, texto) {
        const item = document.createElement(tag);
        if (classe) item.className = classe;
        if (texto !== undefined) item.textContent = texto;
        return item;
    }

    function link(texto, href, classe = "") {
        const item = elemento("a", classe, texto);
        item.href = href;
        return item;
    }

    function atualizarStatus(conectado, texto) {
        statusTempoReal?.classList.toggle("conectado", conectado);
        statusTempoReal?.classList.toggle("desconectado", !conectado);
        if (textoStatus) textoStatus.textContent = texto;
    }

    function mostrarAviso(texto, acao = "") {
        if (!avisoTempoReal || !texto) return;
        window.clearTimeout(temporizadorAviso);
        avisoTempoReal.textContent = texto;
        avisoTempoReal.className = `aviso-tempo-real ${acao}`.trim();
        avisoTempoReal.hidden = false;
        temporizadorAviso = window.setTimeout(() => {
            avisoTempoReal.classList.add("saindo");
            window.setTimeout(() => {
                avisoTempoReal.hidden = true;
                avisoTempoReal.classList.remove("saindo");
            }, 250);
        }, 4500);
    }

    function criarVazio() {
        const vazio = elemento("div", "vazio");
        vazio.append(
            elemento("span", "", "0 × 0"),
            elemento("h3", "", "Ainda não há palpites."),
            elemento("p", "", "Cadastre o primeiro placar para começar o bolão."),
            link(
                "Criar primeiro palpite",
                usuarioId ? "/palpites/novo" : "/login",
                "botao botao-escuro"
            )
        );
        return vazio;
    }

    function criarAcoesParticipante(palpite) {
        const acoes = elemento("div", "participante-acoes");
        acoes.append(link("Ver", `/palpites/${palpite.id}`));

        if (usuarioId && usuarioId === Number(palpite.usuario_id)) {
            acoes.append(link("Editar", `/palpites/${palpite.id}/editar`));
            const formulario = elemento("form");
            formulario.action = `/palpites/${palpite.id}/excluir`;
            formulario.method = "post";
            formulario.dataset.formExcluir = "";
            formulario.append(elemento("button", "", "Excluir"));
            acoes.append(formulario);
        }
        return acoes;
    }

    function criarCard(grupo, destacar) {
        const card = elemento("article", `card-palpite${destacar ? " atualizado-ao-vivo" : ""}`);
        const quantidade = grupo.participantes.length;
        const meta = elemento("div", "card-meta");
        meta.append(
            elemento("span", "", `JOGO ${String(grupo.partida_numero).padStart(3, "0")}`),
            elemento("span", "", `${quantidade} ${quantidade === 1 ? "PALPITE" : "PALPITES"}`)
        );
        card.append(meta);

        if (grupo.contexto) {
            const contexto = grupo.sede ? `${grupo.contexto} · ${grupo.sede}` : grupo.contexto;
            card.append(elemento("p", "contexto-partida", contexto));
        }

        const placar = elemento("div", "placar");
        const resultado = elemento("b");
        resultado.append(
            document.createTextNode(`${grupo.gols_mandante} `),
            elemento("i", "", "×"),
            document.createTextNode(` ${grupo.gols_visitante}`)
        );
        placar.append(
            elemento("strong", "", grupo.mandante),
            resultado,
            elemento("strong", "", grupo.visitante)
        );
        card.append(placar);

        const participantes = elemento("div", "participantes-grupo");
        participantes.append(elemento(
            "p",
            "",
            quantidade === 1 ? "QUEM FEZ ESTE PALPITE" : "QUEM FEZ ESTE MESMO PALPITE"
        ));
        grupo.participantes.forEach((palpite) => {
            const linha = elemento("div", "participante-linha");
            linha.append(
                link(palpite.participante, `/palpites/${palpite.id}`, "participante-nome"),
                criarAcoesParticipante(palpite)
            );
            participantes.append(linha);
        });
        card.append(participantes);
        return card;
    }

    function renderizarEstado(estado, destacar = false) {
        if (!estado || !Array.isArray(estado.grupos) || !listaPalpites) return;
        const total = Number(estado.total_palpites) || 0;
        if (totalPalpites) {
            totalPalpites.textContent = `${total} palpite${total === 1 ? "" : "s"}`;
        }

        if (!estado.grupos.length) {
            listaPalpites.replaceChildren(criarVazio());
            return;
        }

        const grade = elemento("div", "grade-palpites");
        estado.grupos.forEach((grupo) => grade.append(criarCard(grupo, destacar)));
        listaPalpites.replaceChildren(grade);
    }

    function tratarEvento(evento) {
        if (evento.tipo === "presenca" && usuariosOnline) {
            usuariosOnline.textContent = String(evento.usuarios_online ?? 0);
        }

        if (evento.tipo === "estado_palpites") {
            renderizarEstado(evento.estado);
        }

        if (evento.tipo === "palpites_atualizados") {
            renderizarEstado(evento.estado, true);
            mostrarAviso(evento.mensagem, evento.acao);
        }

        if (evento.tipo === "erro") {
            mostrarAviso(evento.mensagem, "erro");
        }
    }

    function conectarWebSocket() {
        window.clearTimeout(temporizadorReconexao);
        atualizarStatus(false, "Conectando ao vivo...");
        const protocolo = window.location.protocol === "https:" ? "wss:" : "ws:";
        websocket = new WebSocket(`${protocolo}//${window.location.host}/ws/palpites`);

        websocket.addEventListener("open", () => {
            atualizarStatus(true, "Ao vivo · conectado");
            websocket.send(JSON.stringify({ tipo: "solicitar_estado" }));
        });

        websocket.addEventListener("message", (eventoMensagem) => {
            try {
                tratarEvento(JSON.parse(eventoMensagem.data));
            } catch (erro) {
                console.warn("Evento WebSocket inválido.", erro);
            }
        });

        websocket.addEventListener("close", () => {
            if (usuariosOnline) usuariosOnline.textContent = "0";
            atualizarStatus(false, "Desconectado · reconectando...");
            if (!paginaEncerrada) {
                temporizadorReconexao = window.setTimeout(conectarWebSocket, 2500);
            }
        });

        websocket.addEventListener("error", () => websocket.close());
    }

    window.addEventListener("pagehide", () => {
        paginaEncerrada = true;
        window.clearTimeout(temporizadorReconexao);
        websocket?.close();
    });

    conectarWebSocket();
});

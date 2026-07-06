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

    document.querySelectorAll("[data-form-excluir]").forEach((formulario) => {
        formulario.addEventListener("submit", (evento) => {
            const confirmou = window.confirm(
                "Tem certeza que deseja excluir este palpite? Esta ação não pode ser desfeita."
            );
            if (!confirmou) evento.preventDefault();
        });
    });

    const mensagem = document.querySelector(".mensagem:not(.erro)");
    if (mensagem) {
        window.setTimeout(() => mensagem.classList.add("oculta"), 4000);
    }
});

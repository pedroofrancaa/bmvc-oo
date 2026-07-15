<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Crie sua conta para participar do bolão da Copa do Mundo 2026.">
    <title>Cadastrar | Copa do Mundo 2026</title>
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
            <a class="nav-novo-palpite" href="/login">Entrar →</a>
        </nav>
        <a class="botao botao-destaque cabecalho-cta" href="/login">
            Entrar <span aria-hidden="true">→</span>
        </a>
    </header>

    <main>
        <section class="cabecalho-formulario">
            <div>
                <p class="rotulo">BOLÃO DA TORCIDA</p>
                <h1>Crie sua<br>conta.</h1>
            </div>
            <p>Cadastre-se para criar, editar e acompanhar os seus palpites do bolão.</p>
        </section>

        <section class="formulario-area">
            % if erro:
            <div class="mensagem erro" role="alert">{{erro}}</div>
            % end

            <form class="formulario formulario-estreito" method="post">
                <div class="formulario-simples">
                    <label>
                        <span>Nome</span>
                        <input type="text" name="nome" value="{{formulario.get('nome', '')}}"
                               placeholder="Como você quer aparecer nos palpites" minlength="2" maxlength="80" required autofocus>
                    </label>
                    <label>
                        <span>Login</span>
                        <input type="text" name="login" value="{{formulario.get('login', '')}}"
                               placeholder="seu.login" minlength="3" maxlength="60" required>
                    </label>
                    <label>
                        <span>Senha</span>
                        <input type="password" name="senha" placeholder="Pelo menos 6 caracteres" minlength="6" required>
                    </label>
                    <label>
                        <span>Confirmar senha</span>
                        <input type="password" name="confirmar_senha" placeholder="Repita a senha" minlength="6" required>
                    </label>
                </div>
                <div class="acoes-formulario">
                    <a href="/login">Já tem conta? Entrar →</a>
                    <button class="botao botao-destaque" type="submit">
                        Cadastrar <span aria-hidden="true">→</span>
                    </button>
                </div>
            </form>
        </section>
    </main>

    <footer>
        <span>COPA DO MUNDO 2026</span>
        <p>O bolão de quem acompanha cada jogo.</p>
    </footer>
</body>
</html>

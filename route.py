import json
import os
from datetime import datetime, timezone
from urllib.parse import urlencode

from app.controllers.application import Application
from app.controllers.tempo_real import PainelTempoReal
from bottle import Bottle, abort, request, static_file
from bottle import redirect, response
from simple_websocket import ConnectionClosed, Server
from werkzeug.serving import run_simple


app = Bottle()
ctl = Application()
tempo_real = PainelTempoReal()

# Chave de assinatura do cookie de sessão. Em produção, viria de uma
# variável de ambiente em vez de ficar hardcoded no repositório.
CHAVE_SESSAO = os.environ.get(
    'BMVC_CHAVE_SESSAO', 'bmvc-copa-2026-chave-local-de-desenvolvimento'
)
COOKIE_SESSAO = 'sessao_usuario_id'


def destino_seguro(destino):
    """Aceita apenas caminhos internos para evitar redirecionamento externo."""
    if isinstance(destino, str) and destino.startswith('/') and not destino.startswith('//'):
        return destino
    return '/palpites'


def usuario_atual():
    usuario_id = request.get_cookie(COOKIE_SESSAO, secret=CHAVE_SESSAO)
    if not usuario_id:
        return None
    try:
        return ctl.usuarios.buscar(int(usuario_id))
    except (TypeError, ValueError):
        return None


def exigir_login():
    usuario = usuario_atual()
    if not usuario:
        redirect('/login?' + urlencode({'proximo': request.path}))
    return usuario


def agora_iso():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


def publicar_alteracao_palpite(acao, palpite):
    verbos = {
        'criado': 'adicionou',
        'atualizado': 'atualizou',
        'excluido': 'removeu',
    }
    mensagem = (
        f"{palpite['participante']} {verbos[acao]} o palpite "
        f"{palpite['mandante']} {palpite['gols_mandante']} x "
        f"{palpite['gols_visitante']} {palpite['visitante']}."
    )
    tempo_real.publicar({
        'tipo': 'palpites_atualizados',
        'acao': acao,
        'mensagem': mensagem,
        'momento': agora_iso(),
        'estado': ctl.estado_palpites(),
    })


#-----------------------------------------------------------------------------
# Rotas:

@app.route('/static/<filepath:path>')
def serve_static(filepath):
    return static_file(filepath, root='./app/static')


#-----------------------------------------------------------------------------
# Suas rotas aqui:

@app.route('/')
def index():
    return redirect('/copa')


@app.route('/copa', method='GET')
def copa():
    return ctl.render('copa', usuario_atual())


@app.route('/copa/dados', method='GET')
def copa_dados():
    response.content_type = 'application/json'
    return json.dumps(ctl.copa_dados(), ensure_ascii=False)


@app.route('/palpites', method='GET')
def palpites():
    return ctl.listar_palpites(request.query.get('mensagem', ''), usuario_atual())


@app.route('/palpites/dados', method='GET')
def palpites_dados():
    response.content_type = 'application/json'
    response.set_header('Cache-Control', 'no-store')
    return json.dumps(ctl.estado_palpites(), ensure_ascii=False)


@app.route('/ws/palpites', method='GET')
def websocket_palpites():
    websocket = Server.accept(
        request.environ,
        ping_interval=25,
        max_message_size=4096,
    )
    tempo_real.registrar(websocket)
    tempo_real.enviar(websocket, {
        'tipo': 'estado_palpites',
        'momento': agora_iso(),
        'estado': ctl.estado_palpites(),
    })

    try:
        while True:
            mensagem = websocket.receive()
            try:
                evento = json.loads(mensagem)
            except (json.JSONDecodeError, TypeError):
                tempo_real.enviar(websocket, {
                    'tipo': 'erro',
                    'mensagem': 'Mensagem WebSocket invalida.',
                })
                continue

            if evento.get('tipo') == 'solicitar_estado':
                tempo_real.enviar(websocket, {
                    'tipo': 'estado_palpites',
                    'momento': agora_iso(),
                    'estado': ctl.estado_palpites(),
                })
            elif evento.get('tipo') == 'ping':
                tempo_real.enviar(websocket, {
                    'tipo': 'pong',
                    'momento': agora_iso(),
                })
    except ConnectionClosed:
        pass
    finally:
        tempo_real.remover(websocket)

    return ''


@app.route('/palpites/novo', method=['GET', 'POST'])
def novo_palpite():
    usuario = exigir_login()

    if request.method == 'GET':
        return ctl.formulario_palpite(usuario)

    formulario = dict(request.forms.decode())
    try:
        dados = ctl.validar_palpite(formulario, usuario)
        palpite_id = ctl.palpites.criar(dados)
        publicar_alteracao_palpite('criado', ctl.palpites.buscar(palpite_id))
        return redirect(f'/palpites/{palpite_id}?mensagem=Palpite criado com sucesso')
    except ValueError as erro:
        return ctl.formulario_palpite(usuario, formulario, str(erro))


@app.route('/palpites/<palpite_id:int>', method='GET')
def detalhe_palpite(palpite_id):
    palpite = ctl.palpites.buscar(palpite_id)
    if not palpite:
        abort(404, 'Palpite não encontrado.')
    palpite['mensagem'] = request.query.get('mensagem', '')
    return ctl.detalhe_palpite(palpite, usuario_atual())


@app.route('/palpites/<palpite_id:int>/editar', method=['GET', 'POST'])
def editar_palpite(palpite_id):
    usuario = exigir_login()
    palpite = ctl.palpites.buscar(palpite_id)
    if not palpite:
        abort(404, 'Palpite não encontrado.')
    if palpite.get('usuario_id') != usuario['id']:
        abort(403, 'Você só pode editar os seus próprios palpites.')

    if request.method == 'GET':
        return ctl.formulario_palpite(usuario, palpite)

    formulario = dict(request.forms.decode())
    formulario['id'] = palpite_id
    try:
        dados = ctl.validar_palpite(formulario, usuario)
        if not ctl.palpites.atualizar(palpite_id, dados, usuario['id']):
            abort(403, 'Você só pode editar os seus próprios palpites.')
        publicar_alteracao_palpite('atualizado', ctl.palpites.buscar(palpite_id))
        return redirect(f'/palpites/{palpite_id}?mensagem=Palpite atualizado com sucesso')
    except ValueError as erro:
        return ctl.formulario_palpite(usuario, formulario, str(erro))


@app.route('/palpites/<palpite_id:int>/excluir', method='POST')
def excluir_palpite(palpite_id):
    usuario = exigir_login()
    palpite = ctl.palpites.buscar(palpite_id)
    if not palpite:
        abort(404, 'Palpite não encontrado.')
    if palpite.get('usuario_id') != usuario['id']:
        abort(403, 'Você só pode excluir os seus próprios palpites.')

    if not ctl.palpites.excluir(palpite_id, usuario['id']):
        abort(403, 'Você só pode excluir os seus próprios palpites.')
    publicar_alteracao_palpite('excluido', palpite)
    return redirect('/palpites?mensagem=Palpite excluído com sucesso')


@app.route('/palpites/meus', method='GET')
def meus_palpites():
    usuario = exigir_login()
    return ctl.meus_palpites(usuario, request.query.get('mensagem', ''))


#-----------------------------------------------------------------------------
# Autenticação:

@app.route('/registro', method=['GET', 'POST'])
def registro():
    if request.method == 'GET':
        return ctl.formulario_registro()

    formulario = dict(request.forms.decode())
    try:
        login = ctl.registrar_usuario(formulario)
        return redirect(f'/login?mensagem=Cadastro criado com sucesso, entre para continuar&login={login}')
    except ValueError as erro:
        return ctl.formulario_registro(formulario, str(erro))


@app.route('/login', method=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return ctl.formulario_login(
            mensagem=request.query.get('mensagem', ''),
            proximo=destino_seguro(request.query.get('proximo', '/palpites')),
            login_sugerido=request.query.get('login', ''),
        )

    formulario = dict(request.forms.decode())
    proximo = destino_seguro(formulario.get('proximo', '/palpites'))
    usuario = ctl.autenticar(formulario.get('login', ''), formulario.get('senha', ''))
    if not usuario:
        return ctl.formulario_login(
            erro='Login ou senha inválidos.',
            proximo=proximo,
            login_sugerido=formulario.get('login', ''),
        )

    response.set_cookie(
        COOKIE_SESSAO, str(usuario['id']),
        secret=CHAVE_SESSAO, path='/', httponly=True, samesite='Lax', max_age=28_800,
    )
    return redirect(proximo)


@app.route('/logout', method='POST')
def logout():
    response.delete_cookie(COOKIE_SESSAO, path='/', samesite='Lax')
    return redirect('/copa')


#-----------------------------------------------------------------------------


if __name__ == '__main__':
    run_simple(
        hostname='0.0.0.0',
        port=8080,
        application=app,
        use_debugger=os.environ.get('BMVC_DEBUG', '1') == '1',
        use_reloader=False,
        threaded=True,
    )

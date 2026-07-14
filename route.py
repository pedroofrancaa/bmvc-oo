import json
import os
from urllib.parse import urlencode

from app.controllers.application import Application
from bottle import Bottle, abort, run, request, static_file
from bottle import redirect, response


app = Bottle()
ctl = Application()

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


@app.route('/palpites/novo', method=['GET', 'POST'])
def novo_palpite():
    usuario = exigir_login()

    if request.method == 'GET':
        return ctl.formulario_palpite(usuario)

    formulario = dict(request.forms.decode())
    try:
        dados = ctl.validar_palpite(formulario, usuario)
        palpite_id = ctl.palpites.criar(dados)
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

    run(app, host='0.0.0.0', port=8080, debug=True)

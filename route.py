import json

from app.controllers.application import Application
from bottle import Bottle, abort, run, request, static_file
from bottle import redirect, response


app = Bottle()
ctl = Application()


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
    return ctl.render('copa')


@app.route('/copa/dados', method='GET')
def copa_dados():
    response.content_type = 'application/json'
    return json.dumps(ctl.copa_dados(), ensure_ascii=False)


@app.route('/palpites', method='GET')
def palpites():
    return ctl.listar_palpites(request.query.get('mensagem', ''))


@app.route('/palpites/novo', method=['GET', 'POST'])
def novo_palpite():
    if request.method == 'GET':
        return ctl.formulario_palpite()

    formulario = dict(request.forms.decode())
    try:
        dados = ctl.validar_palpite(formulario)
        palpite_id = ctl.palpites.criar(dados)
        return redirect(f'/palpites/{palpite_id}?mensagem=Palpite criado com sucesso')
    except ValueError as erro:
        return ctl.formulario_palpite(formulario, str(erro))


@app.route('/palpites/<palpite_id:int>', method='GET')
def detalhe_palpite(palpite_id):
    palpite = ctl.palpites.buscar(palpite_id)
    if not palpite:
        abort(404, 'Palpite não encontrado.')
    palpite['mensagem'] = request.query.get('mensagem', '')
    return ctl.detalhe_palpite(palpite)


@app.route('/palpites/<palpite_id:int>/editar', method=['GET', 'POST'])
def editar_palpite(palpite_id):
    palpite = ctl.palpites.buscar(palpite_id)
    if not palpite:
        abort(404, 'Palpite não encontrado.')

    if request.method == 'GET':
        return ctl.formulario_palpite(palpite)

    formulario = dict(request.forms.decode())
    formulario['id'] = palpite_id
    try:
        dados = ctl.validar_palpite(formulario)
        ctl.palpites.atualizar(palpite_id, dados)
        return redirect(f'/palpites/{palpite_id}?mensagem=Palpite atualizado com sucesso')
    except ValueError as erro:
        return ctl.formulario_palpite(formulario, str(erro))


@app.route('/palpites/<palpite_id:int>/excluir', method='POST')
def excluir_palpite(palpite_id):
    if not ctl.palpites.excluir(palpite_id):
        abort(404, 'Palpite não encontrado.')
    return redirect('/palpites?mensagem=Palpite excluído com sucesso')


#-----------------------------------------------------------------------------


if __name__ == '__main__':

    run(app, host='0.0.0.0', port=8080, debug=True)

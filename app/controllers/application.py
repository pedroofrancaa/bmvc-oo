import json
import os
from datetime import datetime

from bottle import template
from app.models.palpite import Palpite


DB_DIR = os.path.join(os.path.dirname(__file__), 'db')


class Application():

    def __init__(self):
        self.palpites = Palpite()
        self.pages = {
            'copa': self.copa,
        }


    def render(self, page):
        content = self.pages.get(page, self.copa)
        return content()


    def copa(self):
        return template('app/views/html/copa')


    def copa_dados(self):
        caminho = os.path.join(DB_DIR, 'copa.json')
        with open(caminho, encoding='utf-8') as arquivo:
            return json.load(arquivo)


    _NOMES_FASE = {
        'grupos': 'Fase de grupos',
        '32': 'Fase de 32',
        '16': 'Oitavas de final',
        'quartas': 'Quartas de final',
        'semi': 'Semifinal',
        'finais': 'Decisão',
    }

    def listar_palpites(self, mensagem=''):
        dados_copa = self.copa_dados()
        indice = {p['numero']: p for p in dados_copa['partidas']}
        grupos = {}
        total_palpites = 0

        for palpite in self.palpites.todos():
            partida = indice.get(palpite['partida_numero'], {})
            fase = self._NOMES_FASE.get(partida.get('fase', ''), 'Partida')
            chave = (
                palpite['partida_numero'],
                palpite['mandante'],
                palpite['visitante'],
                palpite['gols_mandante'],
                palpite['gols_visitante'],
            )

            if chave not in grupos:
                grupos[chave] = {
                    'partida_numero': palpite['partida_numero'],
                    'mandante': palpite['mandante'],
                    'visitante': palpite['visitante'],
                    'gols_mandante': palpite['gols_mandante'],
                    'gols_visitante': palpite['gols_visitante'],
                    'contexto': fase,
                    'sede': partida.get('sede', ''),
                    'participantes': [],
                }

            grupos[chave]['participantes'].append(palpite)
            total_palpites += 1

        return template(
            'app/views/html/palpites',
            grupos=list(grupos.values()),
            total_palpites=total_palpites,
            mensagem=mensagem,
        )


    def detalhe_palpite(self, palpite):
        try:
            criado_em = datetime.fromisoformat(palpite['criado_em'])
            palpite['criado_em_formatado'] = criado_em.strftime('%d/%m/%Y às %H:%M')
        except (KeyError, TypeError, ValueError):
            palpite['criado_em_formatado'] = 'data não informada'
        return template('app/views/html/palpite_detalhe', palpite=palpite)


    def _time_indefinido(self, nome):
        return nome.startswith('Vencedor ') or nome.startswith('Perdedor ')

    def _nome_time_exibicao(self, nome):
        if nome.startswith('Vencedor '):
            return nome.replace('Vencedor ', 'Vencedor do jogo ', 1)
        if nome.startswith('Perdedor '):
            return nome.replace('Perdedor ', 'Perdedor do jogo ', 1)
        return nome

    def _selecoes_vivas(self, dados_copa):
        vivas = [
            equipe['nome'] for equipe in dados_copa['equipes']
            if not equipe['situacao'].startswith('eliminada')
        ]
        return sorted(vivas)


    def formulario_palpite(self, palpite=None, erro=''):
        dados_copa = self.copa_dados()
        partidas = [
            {
                **partida,
                'mandante_indefinido': self._time_indefinido(partida['mandante']),
                'visitante_indefinido': self._time_indefinido(partida['visitante']),
                'mandante_exibicao': self._nome_time_exibicao(partida['mandante']),
                'visitante_exibicao': self._nome_time_exibicao(partida['visitante']),
            }
            for partida in dados_copa['partidas']
            if partida['status'] != 'encerrado'
            or (palpite and partida['numero'] == palpite.get('partida_numero'))
        ]
        return template(
            'app/views/html/palpite_form',
            palpite=palpite or {},
            partidas=partidas,
            selecoes_vivas=self._selecoes_vivas(dados_copa),
            erro=erro,
        )


    def validar_palpite(self, formulario):
        participante = formulario.get('participante', '').strip()
        if len(participante) < 2:
            raise ValueError('Informe um nome com pelo menos 2 caracteres.')

        try:
            partida_numero = int(formulario.get('partida_numero', ''))
            gols_mandante = int(formulario.get('gols_mandante', ''))
            gols_visitante = int(formulario.get('gols_visitante', ''))
        except (TypeError, ValueError):
            raise ValueError('Selecione uma partida e informe placares válidos.')

        if not 0 <= gols_mandante <= 99 or not 0 <= gols_visitante <= 99:
            raise ValueError('Os gols devem ser números entre 0 e 99.')

        dados_copa = self.copa_dados()
        partida = next(
            (
                item for item in dados_copa['partidas']
                if item['numero'] == partida_numero
            ),
            None,
        )
        if not partida:
            raise ValueError('A partida selecionada não existe.')

        vivas = self._selecoes_vivas(dados_copa)
        mandante = self._resolver_time(
            partida['mandante'], formulario.get('mandante', ''), vivas, 'primeira'
        )
        visitante = self._resolver_time(
            partida['visitante'], formulario.get('visitante', ''), vivas, 'segunda'
        )
        if mandante == visitante:
            raise ValueError('Escolha duas seleções diferentes para o confronto.')

        return {
            'participante': participante,
            'partida_numero': partida_numero,
            'mandante': mandante,
            'visitante': visitante,
            'gols_mandante': gols_mandante,
            'gols_visitante': gols_visitante,
        }


    def _resolver_time(self, time_partida, escolha, vivas, posicao):
        if not self._time_indefinido(time_partida):
            return time_partida

        escolha = escolha.strip()
        if not escolha:
            raise ValueError(f'Escolha a {posicao} seleção para este confronto.')
        if escolha not in vivas:
            raise ValueError(f'A {posicao} seleção escolhida não está mais na disputa.')
        return escolha

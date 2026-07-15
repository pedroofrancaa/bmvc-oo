import json
from threading import RLock


class PainelTempoReal:
    """Mantem e notifica as conexoes WebSocket abertas no painel."""

    def __init__(self):
        self._clientes = set()
        self._lock = RLock()

    @property
    def usuarios_online(self):
        with self._lock:
            return len(self._clientes)

    def registrar(self, cliente):
        with self._lock:
            self._clientes.add(cliente)
        self.publicar_presenca()

    def remover(self, cliente):
        removido = False
        with self._lock:
            if cliente in self._clientes:
                self._clientes.remove(cliente)
                removido = True
        if removido:
            self.publicar_presenca()

    def enviar(self, cliente, evento):
        mensagem = json.dumps(evento, ensure_ascii=False)
        try:
            with self._lock:
                cliente.send(mensagem)
            return True
        except Exception:
            self.remover(cliente)
            return False

    def publicar(self, evento):
        mensagem = json.dumps(evento, ensure_ascii=False)
        desconectados = []

        with self._lock:
            for cliente in tuple(self._clientes):
                try:
                    cliente.send(mensagem)
                except Exception:
                    desconectados.append(cliente)
            for cliente in desconectados:
                self._clientes.discard(cliente)

        if desconectados:
            self.publicar_presenca()

    def publicar_presenca(self):
        self.publicar({
            'tipo': 'presenca',
            'usuarios_online': self.usuarios_online,
        })

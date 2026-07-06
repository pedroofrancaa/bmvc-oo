import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime


DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "controllers",
    "db",
    "bmvc.sqlite3",
)


class Palpite:
    """Modelo responsável pela persistência dos palpites em SQLite."""

    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._criar_tabela()

    @contextmanager
    def _conectar(self):
        conexao = sqlite3.connect(self.db_path)
        conexao.row_factory = sqlite3.Row
        try:
            yield conexao
            conexao.commit()
        except Exception:
            conexao.rollback()
            raise
        finally:
            conexao.close()

    def _criar_tabela(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with self._conectar() as conexao:
            conexao.execute(
                """
                CREATE TABLE IF NOT EXISTS palpites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    participante TEXT NOT NULL,
                    partida_numero INTEGER NOT NULL,
                    mandante TEXT NOT NULL,
                    visitante TEXT NOT NULL,
                    gols_mandante INTEGER NOT NULL CHECK (gols_mandante >= 0),
                    gols_visitante INTEGER NOT NULL CHECK (gols_visitante >= 0),
                    criado_em TEXT NOT NULL,
                    atualizado_em TEXT NOT NULL
                )
                """
            )

    def todos(self):
        with self._conectar() as conexao:
            linhas = conexao.execute(
                """
                SELECT * FROM palpites
                ORDER BY criado_em DESC, id DESC
                """
            ).fetchall()
        return [dict(linha) for linha in linhas]

    def buscar(self, palpite_id):
        with self._conectar() as conexao:
            linha = conexao.execute(
                "SELECT * FROM palpites WHERE id = ?",
                (palpite_id,),
            ).fetchone()
        return dict(linha) if linha else None

    def criar(self, dados):
        agora = datetime.now().isoformat(timespec="seconds")
        with self._conectar() as conexao:
            cursor = conexao.execute(
                """
                INSERT INTO palpites (
                    participante, partida_numero, mandante, visitante,
                    gols_mandante, gols_visitante, criado_em, atualizado_em
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    dados["participante"],
                    dados["partida_numero"],
                    dados["mandante"],
                    dados["visitante"],
                    dados["gols_mandante"],
                    dados["gols_visitante"],
                    agora,
                    agora,
                ),
            )
            return cursor.lastrowid

    def atualizar(self, palpite_id, dados):
        agora = datetime.now().isoformat(timespec="seconds")
        with self._conectar() as conexao:
            cursor = conexao.execute(
                """
                UPDATE palpites
                SET participante = ?, partida_numero = ?, mandante = ?,
                    visitante = ?, gols_mandante = ?, gols_visitante = ?,
                    atualizado_em = ?
                WHERE id = ?
                """,
                (
                    dados["participante"],
                    dados["partida_numero"],
                    dados["mandante"],
                    dados["visitante"],
                    dados["gols_mandante"],
                    dados["gols_visitante"],
                    agora,
                    palpite_id,
                ),
            )
            return cursor.rowcount > 0

    def excluir(self, palpite_id):
        with self._conectar() as conexao:
            cursor = conexao.execute(
                "DELETE FROM palpites WHERE id = ?",
                (palpite_id,),
            )
            return cursor.rowcount > 0

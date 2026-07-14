import binascii
import hashlib
import hmac
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

ITERACOES_HASH = 200_000


class Usuario:
    """Modelo responsável pelo cadastro e autenticação de usuários."""

    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._criar_tabela()

    @contextmanager
    def _conectar(self):
        conexao = sqlite3.connect(self.db_path)
        conexao.row_factory = sqlite3.Row
        conexao.execute("PRAGMA foreign_keys = ON")
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
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    login TEXT NOT NULL UNIQUE,
                    senha_hash TEXT NOT NULL,
                    senha_salt TEXT NOT NULL,
                    criado_em TEXT NOT NULL
                )
                """
            )

    def _hash_senha(self, senha, salt=None):
        if salt is None:
            salt = os.urandom(16)
        hash_bytes = hashlib.pbkdf2_hmac(
            "sha256", senha.encode("utf-8"), salt, ITERACOES_HASH
        )
        return binascii.hexlify(salt).decode(), binascii.hexlify(hash_bytes).decode()

    def criar(self, nome, login, senha):
        salt_hex, hash_hex = self._hash_senha(senha)
        agora = datetime.now().isoformat(timespec="seconds")
        with self._conectar() as conexao:
            cursor = conexao.execute(
                """
                INSERT INTO usuarios (nome, login, senha_hash, senha_salt, criado_em)
                VALUES (?, ?, ?, ?, ?)
                """,
                (nome, login, hash_hex, salt_hex, agora),
            )
            return cursor.lastrowid

    def buscar_por_login(self, login):
        with self._conectar() as conexao:
            linha = conexao.execute(
                "SELECT * FROM usuarios WHERE login = ?",
                (login,),
            ).fetchone()
        return dict(linha) if linha else None

    def buscar(self, usuario_id):
        with self._conectar() as conexao:
            linha = conexao.execute(
                "SELECT * FROM usuarios WHERE id = ?",
                (usuario_id,),
            ).fetchone()
        return dict(linha) if linha else None

    def verificar_senha(self, usuario, senha):
        salt = binascii.unhexlify(usuario["senha_salt"])
        _, hash_calculado = self._hash_senha(senha, salt)
        return hmac.compare_digest(hash_calculado, usuario["senha_hash"])

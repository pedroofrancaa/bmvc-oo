# Usar a imagem base do Python
FROM python:3.12-slim

# Definir o diretório de trabalho
WORKDIR /bmeta

# Instalar as dependencias HTTP e WebSocket
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar a aplicacao para que a imagem tambem funcione sem volume local
COPY . .

# Expor a porta que o aplicativo usa
EXPOSE 8080

# Comando para executar a aplicação
CMD ["python3", "route.py"]

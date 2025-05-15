# 1) imagem base Node LTS
FROM node:18-alpine

# 2) define diretório de trabalho
WORKDIR /app

# 3) copia e instala dependências do backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --only=production

# 4) copia o código backend e a pasta public (frontend já buildado)
COPY backend/server.js ./
COPY public ./public

# 5) expõe a porta 3001
EXPOSE 3001

# 6) variáveis de ambiente defaults
ENV DB_HOST=rds-prova.c0mygcflmcwd.us-east-1.rds.amazonaws.com \
    DB_PORT=5432 \
    DB_USER=postgres \
    DB_PASSWORD=postgres123 \
    DB_NAME=aws_db

# 7) comando de inicialização
CMD ["npm", "start"]

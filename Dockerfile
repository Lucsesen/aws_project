# Etapa única: já que não há TS, usamos um só stage
FROM node:18-alpine
WORKDIR /app

# 1) Copia backend e instala deps
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# 2) Copia código do backend e build do frontend
COPY backend/server.js ./
COPY public ./public

EXPOSE 3001

ENV DB_HOST=rds-prova.c0mygcflmcwd.us-east-1.rds.amazonaws.com \
    DB_PORT=5432 \
    DB_USER=postgres \
    DB_PASSWORD=postgres123 \
    DB_NAME=aws_db \
    PORT=3001

CMD ["npm","start"]

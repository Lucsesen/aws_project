import express from 'express';
import path from 'path';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3001;

// configurações do Postgres via variáveis de ambiente (podem vir do ECS)
const pool = new Pool({
  host:     process.env.DB_HOST     || 'rds-prova.c0mygcflmcwd.us-east-1.rds.amazonaws.com',
  port:     process.env.DB_PORT     ? parseInt(process.env.DB_PORT) : 5432,
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME     || 'aws_db',
});

// middleware
app.use(express.json());

// endpoint de healthcheck e teste de conexão ao banco
app.get('/api/health', async (_req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// TODO: adicione aqui outros endpoints baseados na lógica do seu front-end

// serve os arquivos estáticos do front-end
app.use(express.static(path.resolve('public')));
app.get('*', (_req, res) =>
  res.sendFile(path.resolve('public', 'index.html'))
);

// inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

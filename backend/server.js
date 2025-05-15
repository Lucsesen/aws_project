import express from 'express';
import path from 'path';
import { Pool } from 'pg';

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

const pool = new Pool({
  host:     process.env.DB_HOST     || 'rds-prova.c0mygcflmcwd.us-east-1.rds.amazonaws.com',
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME     || 'aws_db',
});

app.use(express.json());

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// — CRUD de Item (baseado no seu TS original) —

// Listar
app.get('/api/items', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "Item" ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar
app.post('/api/items', async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO "Item"(name, quantity) VALUES($1,$2) RETURNING *',
      [name, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params, { name, quantity } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE "Item" SET name=$1,quantity=$2 WHERE id=$3 RETURNING *',
      [name, quantity, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "Item" WHERE id=$1', [id]);
    if (result.rowCount===0) return res.status(404).json({ error:'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve o frontend estático
const publicDir = path.resolve('public');
app.use(express.static(publicDir));
app.get('*', (_req, res) =>
  res.sendFile(path.join(publicDir, 'index.html'))
);

app.listen(port, () =>
  console.log(`🚀 Backend+Frontend rodando na porta ${port}`)
);

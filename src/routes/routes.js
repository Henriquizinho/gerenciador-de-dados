const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Configurações de conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'gerenciador_de_dados',
    password: 'sua_senha',
    port: 5432,
});

// Rota para obter todos os itens
router.get('/itens', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM itens');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Middleware de autenticação
router.use(authMiddleware);

// Rota para criar um novo item
router.post('/itens', async (req, res) => {
    const { nome, descricao } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO itens (nome, descricao) VALUES ($1, $2) RETURNING *',
            [nome, descricao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para atualizar um item existente
router.put('/itens/:id', async (req, res) => {
    const { nome, descricao } = req.body;
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE itens SET nome = $1, descricao = $2 WHERE id = $3',
            [nome, descricao, id]
        );
        res.json({ message: 'Item atualizado com sucesso' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para deletar um item
router.delete('/itens/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM itens WHERE id = $1', [id]);
        res.json({ message: 'Item deletado com sucesso' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

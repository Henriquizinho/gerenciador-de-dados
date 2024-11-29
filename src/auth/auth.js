const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Configurações de conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'gerenciador_de_dados',
    password: 'sua_senha',
    port: 5432,
});

// Rota para login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).send('Usuário não encontrado');
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Senha incorreta');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, 'seu_segredo_jwt', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

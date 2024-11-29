const express = require('express');
const rotas = require('../src/routes/routes');
const auth = require('../src/auth/auth');
const path = require('path');

const app = express();

// Configura o middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware para processar dados do tipo application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para autenticação
app.use('/auth', auth);

// Usar as rotas definidas no arquivo 'routes'
app.use('/api', rotas);

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor: http://localhost:3000');
});

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send('Token não fornecido');
    }
    jwt.verify(token, 'seu_segredo_jwt', (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }
        if (decoded.role !== 'admin') {
            return res.status(403).send('Acesso negado');
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = authMiddleware;

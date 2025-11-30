const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        console.log("No hay token");
        ("No tiene token")
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos los datos del token en req.user
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = authenticate;
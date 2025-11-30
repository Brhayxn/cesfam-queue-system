const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Ruta para registrar usuario (hashear contraseña)
exports.registrar = async (req, res) => {
    const { username ,nombre , pass , rol } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'nombre de usuario requerido' });
    }
    if (!nombre) {
        return res.status(400).json({ error: 'nombre requerido' });
    }
    if (!pass) {
        return res.status(400).json({ error: 'Contraseña requerida' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        const newUser = await Usuario.create({
            username : username,
            nombre: nombre,
            pass: hashedPassword,
            rol:rol
        });
            const io = req.app.locals.io;
            io.emit("usuarioNuevo",newUser)
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }
        res.status(500).json({ error: 'Hubo un problema al crear el usuario', });
    }
};

exports.deleteUser = async(req,res)=>{
    const idUser = req.params.id
    await Usuario.destroy({
        where : {
            id:idUser
        }
    })
    const io = req.app.locals.io;
    io.emit("usuarioEliminado")
    res.status(200).json({mesagge:'Usuario eliminado'})
}

// Ruta para login (verificar contraseña)
exports.login = async (req, res) => {
    const { username,pass } = req.body;
    const saltRounds = 10;
    try {
        const user = await Usuario.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const verificacion = await bcrypt.compare(pass, user.pass);
        if(!verificacion){
            return res.status(401).json({error:'La contraseña no es valida'});
        }
        // Generar token JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                rol:user.rol
            },
            process.env.JWT_SECRET, // Clave secreta desde .env
            {
                expiresIn: process.env.JWT_EXPIRES_IN // Tiempo de expiración
            }
        );
        res.json({
            message: 'Login exitoso',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.verUsuarios = async(req,res)=>{
    const usuarios = await Usuario.findAll({
        attributes : ['id','username', 'nombre','rol', 'createdAt']
    })
    res.status(200).json(usuarios)
}
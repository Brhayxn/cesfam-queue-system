const { DataTypes } = require('sequelize');
const sequalize = require('../config/database')

const Usuario = sequalize.define('Usuario', {
    username : {
        type : DataTypes.STRING,
        allowNull : false,
        unique:true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pass:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('administrador','medico','categorizador','acceso','publico'),
        allowNull: false
    }
})

module.exports = Usuario;
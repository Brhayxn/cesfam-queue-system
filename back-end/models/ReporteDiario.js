const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// models/ReporteDiario.js

  const ReporteDiario = sequelize.define('ReporteDiario', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    actividad: {
      type: DataTypes.JSON, // o DataTypes.TEXT si usas JSON.stringify
      allowNull: false
    },
    promedio: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    registros: {
      type: DataTypes.INTEGER, // { RegistrosValidos: '2' }
      allowNull: false
    },
    cancelados: {
      type: DataTypes.INTEGER, // [ { cantidad: '5' } ]
      allowNull: false
    }
  });



module.exports = ReporteDiario;


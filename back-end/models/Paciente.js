const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
  rut: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM('C1', 'C2', 'C3', 'C4', 'C5'),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('En espera','En atencion','En observacion','Ingresado','Atendido', 'Cancelado'),
    defaultValue: 'Ingresado',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  indexes: [
    { fields: ['estado'] },
    { fields: ['categoria'] },
    { fields: ['updatedAt'] },
    { fields: ['createdAt'] },
    { fields: ['estado', 'updatedAt'] }  // Índice compuesto, agiliza el endpoint "Atendido"
  ],
  createdAt: false,
  updatedAt: true
});

module.exports = Paciente;
const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

const Evento = db.define('Evento', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dataInicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dataFim: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        defaultValue: 'farmacia',
    }
})

module.exports = Evento
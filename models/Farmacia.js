const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Farmacia = db.define('Farmacia', {
    nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dataInicio: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dataFim: {
        type: DataTypes.DATE,
        allowNull: true
    }
})

module.exports = Farmacia 
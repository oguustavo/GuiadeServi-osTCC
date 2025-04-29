const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Emprego = db.define('Emprego', {
    cargo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipoVaga: {
        type: DataTypes.STRING,
        allowNull: true
    },
    requisitos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contato: {
        type: DataTypes.STRING,
        allowNull: true
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Emprego 
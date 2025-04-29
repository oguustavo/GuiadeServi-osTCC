const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Mercado = db.define('Mercado', {
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
    subtipo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Mercado 
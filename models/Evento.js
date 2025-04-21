const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Evento = db.define('Evento', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtipo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagem: {
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

module.exports = Evento
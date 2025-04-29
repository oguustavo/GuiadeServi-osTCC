const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const EventoCidade = db.define('EventoCidade', {
    nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipoEvento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data: {
        type: DataTypes.DATE,
        allowNull: true
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: true
    },
    local: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vendaPresencial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    linkInscricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = EventoCidade 
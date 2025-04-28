const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Evento = db.define('Evento', {
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
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtipo: {
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
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Novos campos para vagas de emprego
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
    // Novos campos para eventos
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
    }
})

module.exports = Evento
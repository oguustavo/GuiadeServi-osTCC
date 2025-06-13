const { DataTypes } = require('sequelize')
const conn = require('../db/conn')
const User = require('./User')

const PremiumPost = conn.define('PremiumPost', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    whatsappLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    workType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
})

PremiumPost.belongsTo(User)
User.hasMany(PremiumPost)

module.exports = PremiumPost 
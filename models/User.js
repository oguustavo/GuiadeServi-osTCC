const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = db.define('User',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    matricula:{
        type: DataTypes.STRING,
        require:false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    premiumPlan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    premiumExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    premiumPostsRemaining: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
})
module.exports = User
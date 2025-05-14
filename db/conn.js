const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('eventos2','root','',{

    host:'localhost',
    dialect:'mysql',
})

try {
    sequelize.authenticate()
    console.log('conectamos')
} catch (error) {
    console.log(`não conectamos:${err}`)
}


sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados atualizado com sucesso!')
    })
    .catch((error) => {
        console.error('Erro ao atualizar o banco de dados:', error)
    })

module.exports = sequelize
const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('eventos2','root','root',{

    host:'localhost',
    dialect:'mysql',
})

try {
    sequelize.authenticate()
    console.log('conectamos')
} catch (error) {
    console.log(`não conectamos:${err}`)
}

// Sincroniza o modelo com o banco de dados
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados atualizado com sucesso!')
    })
    .catch((error) => {
        console.error('Erro ao atualizar o banco de dados:', error)
    })

module.exports = sequelize
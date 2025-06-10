const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

try {
  sequelize.authenticate();
  console.log('Conectado ao banco de dados PostgreSQL com sucesso!');
} catch (error) {
  console.log(`Erro ao conectar ao banco de dados: ${error}`);
}

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados atualizado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao atualizar o banco de dados:', error);
  });

module.exports = sequelize;
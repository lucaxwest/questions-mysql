const { Sequelize } = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'Aguia@123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete','root','Myehia@237',
{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
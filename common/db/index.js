const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_URL);

module.exports = db;

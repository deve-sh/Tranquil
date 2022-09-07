const { Sequelize } = require("sequelize");

console.log(process.env.DB_URL);
const db = new Sequelize(process.env.DB_URL, { dialect: "mysql" });

module.exports = db;

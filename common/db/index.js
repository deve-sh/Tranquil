const { Sequelize } = require("sequelize");
const pg = require("pg");

const db = new Sequelize(process.env.DB_URL, {
	dialect: "postgres",
	dialectModule: pg,
});

module.exports = db;

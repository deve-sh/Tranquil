const mongoose = require("mongoose");

const setupMongoDBConnection = async () => mongoose.connect(process.env.DB_URL);

module.exports = setupMongoDBConnection;

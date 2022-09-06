const { DataTypes } = require("sequelize");
const db = require("../index");

const PortUsed = db.define(
	"PortUsed",
	{
		portNumber: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		id: {
			type: DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
			allowNull: false,
			defaultValue: literal("gen_random_uuid()"),
		},
		projectId: {
			type: DataTypes.UUIDV4,
			unique: true,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: "PortsUsed",
	}
);

module.exports = PortUsed;

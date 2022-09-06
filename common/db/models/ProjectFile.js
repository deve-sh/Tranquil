const { DataTypes, literal } = require("sequelize");
const db = require("../index");

const ProjectFile = db.define(
	"ProjectFile",
	{
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
			primaryKey: true,
		},
		contents: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
	},
	{
		timestamps: true,
		tableName: "ProjectFiles",
	}
);

module.exports = ProjectFile;

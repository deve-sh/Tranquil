const { DataTypes, ENUM, literal } = require("sequelize");
const db = require("../index");

const ProjectFile = require("./ProjectFile");
const PortUsed = require("./PortUsed");

const Project = db.define(
	"Project",
	{
		projectName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id: {
			type: DataTypes.UUIDV4,
			unique: true,
			primaryKey: true,
			allowNull: false,
			defaultValue: literal("gen_random_uuid()"),
		},
		createdBy: {
			type: DataTypes.UUIDV4,
			allowNull: true,
		},
		template: {
			type: ENUM("CRA", "Next.js"),
			allowNull: false,
			defaultValue: "CRA",
		},
	},
	{
		timestamps: true,
		tableName: "Projects",
	}
);

Project.hasMany(ProjectFile, { foreignKey: "projectId" });
Project.hasOne(PortUsed, { foreignKey: "projectId" });

module.exports = Project;

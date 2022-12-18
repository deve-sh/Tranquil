const { Schema, model } = require("mongoose");

const Project = new Schema(
	{
		projectName: {
			type: String,
			required: true,
		},
		createdBy: {
			type: String,
			default: "",
		},
		template: {
			type: String,
			enum: ["CRA", "Next"],
			required: true,
			default: "CRA",
		},
	},
	{ timestamps: true }
);

module.exports = model("Project", Project);

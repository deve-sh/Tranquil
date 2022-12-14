const { Schema, model } = require("mongoose");

const RunningProject = new Schema(
	{
		publicIP: {
			type: String,
			required: true,
		},
		publicURL: {
			type: String,
			required: true,
		},
		secureURL: String,
		machineId: {
			type: String,
			required: true,
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			unique: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("RunningProject", RunningProject);

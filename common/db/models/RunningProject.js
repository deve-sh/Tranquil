const { Schema, model } = require("mongoose");

const RunningProject = new Schema(
	{
		url: {
			type: String,
			required: true,
		},
		machineId: {
			type: String,
			required: true,
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
		},
	},
	{ timestamps: true }
);

module.exports = model("RunningProject", RunningProject);

const { Schema, model } = require("mongoose");

const RunningProject = new Schema(
	{
		publicIP: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["live", "starting"],
			required: true,
		},
		publicURL: {
			type: String,
			default: "",
		},
		secureURL: String,
		machineId: {
			type: String,
			default: "",
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			unique: true,
		},
		instanceMetaData: { type: Object, default: {} },
	},
	{ timestamps: true }
);

module.exports = model("RunningProject", RunningProject);

const { Schema, model } = require("mongoose");

const EnvironmentVariable = new Schema(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		key: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("EnvironmentVariable", EnvironmentVariable);

const { Schema, model } = require("mongoose");

const ProjectFile = new Schema(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Project",
		},
		contents: {
			type: String,
			default: "",
		},
		path: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("ProjectFile", ProjectFile);

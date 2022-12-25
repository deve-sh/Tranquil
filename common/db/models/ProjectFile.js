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
		isReadableContent: {
			// Defines whether the content of a file can be read and edited by the user.
			// Unlike an image or video type where the user isn't allowed to see, we'll show "binary data" message in such a case.
			type: boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("ProjectFile", ProjectFile);

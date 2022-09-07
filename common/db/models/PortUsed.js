const { Schema, model } = require("mongoose");

const PortUsed = new Schema(
	{
		portNumber: {
			type: Number,
			required: true,
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
		},
	},
	{ timestamps: true }
);

module.exports = model("PortUsed", PortUsed);

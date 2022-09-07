const ProjectFile = require("../../common/db/models/ProjectFile");

module.exports.getProjectFileList = async (req, res) => {
	try {
		const { projectId } = req.params;
		const fileList = await ProjectFile.find({ projectId })
			.select("-contents -__v")
			.lean();
		return res.send({ message: "Retreived File List successfully", fileList });
	} catch (err) {
		return res
			.status(500)
			.send({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports.getFileContents = async (req, res) => {
	try {
		const { fileId } = req.params;
		const file = await ProjectFile.findById(fileId).select("contents").lean();
		if (!file) return res.sendStatus(404);
		return res.send(file.contents);
	} catch (err) {
		return res
			.status(500)
			.send({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports.updateFile = (req, res) => {
	// operation -> update, delete, create
	// if newContent is null, that also technically equates to a delete operation.
	const { fileId, newContent, operation = "update" } = req.body;

	switch (operation) {
		case "create":
			return res.sendStatus(201);
		case "delete":
			return res.sendStatus(204);
		case "update":
			return res.sendStatus(200);
		default:
			return res.sendStatus(200);
	}
};

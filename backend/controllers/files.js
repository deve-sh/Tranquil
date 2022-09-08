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

module.exports.updateFile = async (req, res) => {
	try {
		// operation -> update, delete, create
		// if newContent is null, that also technically equates to a delete operation.
		const { path, newContent, operation = "update" } = req.body;
		const { fileId, projectId } = req.params;

		switch (operation) {
			case "create":
				const fileToCreate = new ProjectFile({
					path,
					contents: newContent,
					projectId,
				});
				await fileToCreate.save();
				return res
					.status(201)
					.json({ message: "Created File Successfully", file: fileToCreate });
			case "delete":
			case "update":
				const file = await ProjectFile.findById(fileId);
				if (operation === "delete") {
					if (file) await file.delete();
					return res.sendStatus(204);
				} else {
					if (file) {
						file.contents = newContent || "";
						file.path = path;
						await file.save();
						return res.sendStatus(200);
					}
					return res.sendStatus(404);
				}
			default:
				return res.sendStatus(200);
		}
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

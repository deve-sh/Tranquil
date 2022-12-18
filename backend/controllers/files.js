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
				res
					.status(201)
					.json({ message: "Created File Successfully", file: fileToCreate });
				break;
			case "delete":
				const fileToDelete = await ProjectFile.findById(fileId);
				if (fileToDelete) await fileToDelete.delete();
				res.sendStatus(204);
				break;
			case "update":
				const fileToUpdate = await ProjectFile.findById(fileId);
				if (fileToUpdate) {
					fileToUpdate.contents = newContent || "";
					fileToUpdate.path = path;
					await fileToUpdate.save();
					res.sendStatus(200);
				}
				res.sendStatus(404);
				break;
			default:
				res.sendStatus(200);
				break;
		}

		const fileUpdatePayload = {
			operation,
			newContent,
			path,
		};

		const sendFileUpdateMessage = require("../socket/sendFileUpdateMessage");
		sendFileUpdateMessage(projectId, fileUpdatePayload);
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

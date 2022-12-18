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

module.exports.createFile = async (req, res) => {
	try {
		const { path, contents } = req.body;
		const { projectId } = req.params;

		// Check if a file at the path already exists.
		const fileAlreadyExists = await ProjectFile.findOne({ path, projectId });
		if (fileAlreadyExists)
			return res
				.status(400)
				.json({ error: "File already exists at that path." });

		const fileToCreate = new ProjectFile({
			path,
			contents,
			projectId,
		});
		await fileToCreate.save();
		res
			.status(201)
			.json({ message: "Created File Successfully", file: fileToCreate._id });

		const fileCreatePayloadForSocket = {
			operation: "create",
			newContent: contents,
			path,
		};
		const sendFileUpdateMessage = require("../socket/sendFileUpdateMessage");
		sendFileUpdateMessage(projectId, fileCreatePayloadForSocket);
	} catch (err) {
		console.log(err);
		if (!res.headersSent)
			return res
				.status(500)
				.json({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports.updateFile = async (req, res) => {
	try {
		// operation -> update, delete
		const { path, newContent, operation = "update" } = req.body;
		const { fileId, projectId } = req.params;

		if (operation === "delete") {
			const fileToDelete = await ProjectFile.findById(fileId);
			if (fileToDelete) await fileToDelete.delete();
			res.sendStatus(204);
		}
		if (operation === "update") {
			const fileToUpdate = await ProjectFile.findById(fileId);
			if (fileToUpdate) {
				fileToUpdate.contents = newContent || "";
				fileToUpdate.path = path;
				await fileToUpdate.save();
				res.sendStatus(200);
			} else res.sendStatus(404);
		}

		const fileUpdatePayloadForSocket = {
			operation,
			newContent,
			path,
		};
		const sendFileUpdateMessage = require("../socket/sendFileUpdateMessage");
		sendFileUpdateMessage(projectId, fileUpdatePayloadForSocket);
	} catch (err) {
		console.log(err);
		if (!res.headersSent)
			return res
				.status(500)
				.json({ message: err.message, error: "Internal Server Error" });
	}
};

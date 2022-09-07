const ProjectFile = require("../../../common/db/models/ProjectFile");

module.exports.getProjectFileList = async (req, res) => {
	const { projectId } = req.params;
	const fileList = await ProjectFile.findAll({
		where: { projectId },
		attributes: ["id", "path"],
	});
	return res.send({ message: "Retreived File List successfully", fileList });
};

module.exports.getFileContents = async (req, res) => {
	const { fileId } = req.params;
	const fileContents = await ProjectFile.findOne({
		where: { id: fileId },
		attributes: "contents",
	});
	if (!fileContents) return res.sendStatus(404);
	return res.send(fileContents);
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

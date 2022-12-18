module.exports = async (projectId) => {
	const ProjectFile = require("../db/models/ProjectFile");
	const projectFiles = await ProjectFile.find({ projectId })
		.select("-__v")
		.lean();
	return projectFiles || [];
};

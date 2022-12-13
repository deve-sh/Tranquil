const getRunningProjectPath = (projectId) => {
	const path = require("path");
	const projectFolderPath = path.resolve(
		process.cwd(),
		"../running-projects/" + projectId
	);
	return projectFolderPath;
};

module.exports = getRunningProjectPath;

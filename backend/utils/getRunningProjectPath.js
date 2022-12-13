const getRunningProjectPath = (projectId) => {
	const projectFolderPath = path.resolve(
		process.cwd(),
		"../running-projects/" + projectId
	);
	return projectFolderPath;
};

module.exports = getRunningProjectPath;

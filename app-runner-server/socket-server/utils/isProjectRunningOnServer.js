const { readdir } = require("fs");

const isProjectRunningOnServer = (projectId) => {
	readdir("../../running-projects", { withFileTypes: true }, (err, files) => {
		if (err) return false;
		return files
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
			.some((projectDirectoryName) => projectDirectoryName === projectId);
	});
};

module.exports = isProjectRunningOnServer;

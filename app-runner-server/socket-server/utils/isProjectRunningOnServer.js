const { readdir } = require("fs");

const isProjectRunningOnServer = (projectId) => {
	return new Promise((resolve) => {
		readdir("../../running-projects", { withFileTypes: true }, (err, files) => {
			if (err) return resolve(false);
			return resolve(
				files
					.filter((dirent) => dirent.isDirectory())
					.map((dirent) => dirent.name)
					.some((projectDirectoryName) => projectDirectoryName === projectId)
			);
		});
	});
};

module.exports = isProjectRunningOnServer;

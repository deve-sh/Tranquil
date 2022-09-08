const { readdir } = require("fs");
const path = require("path");

const isProjectRunningOnServer = (projectId) => {
	return new Promise((resolve) => {
		readdir(
			path.resolve(process.cwd(), "../running-projects"),
			{ withFileTypes: true },
			(err, files) => {
				if (err) return resolve(false);
				return resolve(
					files
						.filter((dirent) => dirent.isDirectory())
						.map((dirent) => dirent.name)
						.some((projectDirectoryName) => projectDirectoryName === projectId)
				);
			}
		);
	});
};

module.exports = isProjectRunningOnServer;

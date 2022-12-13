const { readdirSync } = require("fs-extra");
const path = require("path");

const isProjectRunningOnServer = (projectId) => {
	try {
		return (
			readdirSync(
				path.resolve(process.cwd(), "../running-projects/" + projectId)
			).length > 0
		);
	} catch {
		return false;
	}
};

module.exports = isProjectRunningOnServer;

const fse = require("fs-extra");
const killPort = require("kill-port");

const PortUsed = require("../../../common/db/models/PortUsed");
const isProjectRunningOnServer = require("../utils/isProjectRunningOnServer");

const initializeProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is already running on server.
		const isProjectAlreadyRunning = await isProjectRunningOnServer(projectId);
		if (!isProjectAlreadyRunning)
			return res.json({ message: "Project is already shut down." });

		fse.emptyDirSync(`running-projects/${projectId}`);
		fse.rmdirSync(`running-projects/${projectId}`);

		const port = await PortUsed.findOne({ projectId });
		await killPort(port.portNumber).catch(() => null);

		return res.json({ message: "Project Initialized Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports = initializeProject;

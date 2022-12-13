const { execSync } = require("child_process");
const fse = require("fs-extra");
const path = require("path");
const Project = require("../../common/db/models/Project");

const isProjectRunningOnServer = require("../utils/isProjectRunningOnServer");

module.exports.initializeProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		const projectFromDatabase = await Project.findOne({ _id: projectId });
		if (!projectFromDatabase)
			return res.status(404).json({ error: "Project not found." });

		let installCommand, startCommand;
		try {
			const { template } = projectFromDatabase;
			const getTemplateInfo = require("../utils/getTemplateInfo");
			const templateInfo = getTemplateInfo(template);

			installCommand = templateInfo.installCommand;
			startCommand = templateInfo.startCommand;
		} catch {
			return res.status(400).json({ error: "Invalid or unsupported project." });
		}

		// Check if project is already running on server.
		const isProjectAlreadyRunning = isProjectRunningOnServer(projectId);
		if (isProjectAlreadyRunning)
			return res.json({ message: "Project is already running on server." });

		const projectFolderPath = path.resolve(
			process.cwd(),
			"../running-projects/" + projectId
		);

		const generateRandomPortNumber = require("../utils/generateRandomPortNumber");
		const getAllFilesForProject = require("../../common/operations/getAllFilesForProject");
		const projectFiles = await getAllFilesForProject(projectId);
		if (projectFiles.length) {
			const fileCreationPromises = [];
			for (let file of projectFiles) {
				fileCreationPromises.push(
					fse.outputFile(projectFolderPath + "/" + file.path, file.contents)
				);
			}
			await Promise.all(fileCreationPromises);
		}
		// Run npm install and then start the project on a port
		const portForProject = await generateRandomPortNumber(projectId);
		if (portForProject) {
			fse.writeFileSync(
				path.resolve(projectFolderPath, ".env"),
				`PORT=${Number(portForProject)}`
			);
			execSync(
				`cd ${projectFolderPath} && npm install && PORT=${portForProject} ${startCommand}`,
				{ stdio: "inherit" }
			);
		}
		return res.json({
			message: "Project Initialized Successfully at port: " + portForProject,
			port: portForProject,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports.shutDownProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is already running on server.
		const PortUsed = require("../../common/db/models/PortUsed");
		const isProjectAlreadyRunning = isProjectRunningOnServer(projectId);
		if (!isProjectAlreadyRunning)
			return res.json({ message: "Project is already shut down." });

		fse.emptyDirSync(`running-projects/${projectId}`);
		fse.rmdirSync(`running-projects/${projectId}`);

		const port = await PortUsed.findOne({ projectId });
		if (port) {
			const killPort = require("kill-port");
			await Promise.allSettled([
				killPort(port.portNumber).catch(() => null),
				port.delete(),
			]);
		}

		return res.json({ message: "Project Shut Down Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

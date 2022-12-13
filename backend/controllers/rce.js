const fse = require("fs-extra");

const Project = require("../../common/db/models/Project");

const getRunningProjectPath = require("../utils/getRunningProjectPath");
const isProjectRunningOnServer = require("../utils/isProjectRunningOnServer");
const spawnAppProcess = require("../utils/spawnAppProcess");

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
			return res.json({
				message: "Project is already running on server.",
				alreadyRunning: true,
			});

		const projectFolderPath = getRunningProjectPath();

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

		if (!portForProject)
			return res.json({
				message: "Project might already be running.",
				alreadyRunning: true,
			});

		spawnAppProcess({
			projectId,
			installCommand,
			startCommand,
			environmentVars: { ...process.env, PORT: portForProject },
			onDataStream: (data) => {
				console.log(`child stdout:\n${data}`);
			},
			onErrorStream: (data) => {
				console.error(`child stderr:\n${data}`);
			},
		});
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

		const projectPath = getRunningProjectPath(projectId);
		fse.emptyDirSync(projectPath);
		fse.rmdirSync(projectPath);

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

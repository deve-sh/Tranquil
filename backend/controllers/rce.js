const fse = require("fs-extra");

const Project = require("../../common/db/models/Project");
const sendMessageToProjectSocketRoom = require("../socket/sendMessageToProjectSocketRoom");
const sendMessageToProjectAppRunner = require("../socket/sendMessageToProjectAppRunner");

module.exports.initializeProjectLocally = async (req, res) => {
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
		const isProjectRunningOnServer = require("../utils/rce-local/isProjectRunningOnServer");
		const isProjectAlreadyRunning = isProjectRunningOnServer(projectId);
		if (isProjectAlreadyRunning)
			return res.json({
				message: "Project is already running on server.",
				alreadyRunning: true,
			});

		const getRunningProjectPath = require("../utils/rce-local/getRunningProjectPath");
		const projectFolderPath = getRunningProjectPath();

		const generateRandomPortNumber = require("../utils/rce-local/generateRandomPortNumber");
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

		const spawnAppProcess = require("../utils/rce-local/spawnAppProcess");
		spawnAppProcess({
			projectId,
			installCommand,
			startCommand,
			environmentVars: { ...process.env, PORT: portForProject },
			onDataStream: (data) => {
				// todo: Stream these logs to connected client devices.
				console.log(`child stdout:\n${data}`);
			},
			onErrorStream: (data) => {
				// todo: Stream these logs to connected client devices.
				console.error(`child stderr:\n${data}`);
			},
		});
		// todo: Connect to HMR server for the started up project.
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

module.exports.shutDownProjectLocally = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is already running on server.
		const isProjectRunningOnServer = require("../utils/rce-local/isProjectRunningOnServer");
		const isProjectAlreadyRunning = isProjectRunningOnServer(projectId);
		if (!isProjectAlreadyRunning)
			return res.json({ message: "Project is already shut down." });

		const getRunningProjectPath = require("../utils/rce-local/getRunningProjectPath");
		const projectPath = getRunningProjectPath(projectId);
		fse.emptyDirSync(projectPath);
		fse.rmdirSync(projectPath);

		const PortUsed = require("../../common/db/models/PortUsed");
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

/**
 * The real deal. Initializing and Stopping of projects on an EC2 instance.
 */
module.exports.initializeProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		const projectFromDatabase = await Project.findOne({ _id: projectId });
		if (!projectFromDatabase)
			return res.status(404).json({ error: "Project not found." });

		// Check if project is running on an instance
		const RunningProject = require("../../common/db/models/RunningProject");
		const runningProjectDocInDB = await RunningProject.findOne({ projectId });

		if (
			runningProjectDocInDB &&
			runningProjectDocInDB.status === "live" &&
			runningProjectDocInDB.publicURL &&
			runningProjectDocInDB.machineId
		)
			return res.json({
				message: "Project is already running",
				publicIP: runningProjectDocInDB.publicIP,
				publicURL: runningProjectDocInDB.publicURL,
			});

		if (runningProjectDocInDB && runningProjectDocInDB.status === "starting")
			return res.json({
				message: "Project is currently starting up.",
			});

		const { PROJECT_INIT_UPDATE } = require("../../common/socketTypes");

		const newProjectRunningDoc = new RunningProject({
			projectId,
			status: "starting",
		});
		await newProjectRunningDoc.save();
		res.json({ message: "Project initialization started" });

		// Continue Project initialization in the background.
		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "instance-creation-started",
		});
		const createProjectEC2Instance = require("../utils/rce/createProjectEC2Instance");
		const { data: instance, error: errorCreatingInstance } =
			await createProjectEC2Instance(projectId);
		if (errorCreatingInstance)
			return sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
				step: "instance-creation-failed",
				error: errorCreatingInstance.message,
			});

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "instance-creation-successful",
		});

		const copyFilesAndStartAppOnInstance = require("../utils/rce/copyFilesAndStartAppOnInstance");
		const { template } = projectFromDatabase;
		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "app-setup-started",
		});
		const { error: errorStartingApp } = await copyFilesAndStartAppOnInstance(
			projectId,
			template,
			instance
		);

		if (errorStartingApp) {
			const shutDownProjectEC2Instance = require("../utils/rce/shutDownEC2Instance");
			await shutDownProjectEC2Instance(instance.InstanceId);
			return sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
				step: "app-setup-failed",
				error: errorStartingApp.message,
			});
		}

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "app-setup-succeeded",
		});

		// Save this project's status in DB
		newProjectRunningDoc.publicIP = instance.PublicIpAddress;
		newProjectRunningDoc.publicURL = instance.PublicDnsName;
		newProjectRunningDoc.machineId = instance.InstanceId;
		newProjectRunningDoc.instanceMetaData = instance;
		newProjectRunningDoc.status = "live";
		await newProjectRunningDoc.save();

		return sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "project-initialization-completed",
			publicIP: instance.PublicIpAddress,
			publicURL: instance.PublicDnsName,
		});
	} catch (err) {
		if (!res.headersSent)
			return res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports.shutDownProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is actually running on an EC2 server.
		const RunningProject = require("../../common/db/models/RunningProject");
		const runningProjectDocInDB = await RunningProject.findOne({ projectId });

		if (!runningProjectDocInDB)
			return res.json({ message: "Project is already shut down" });

		if (runningProjectDocInDB.machineId) {
			const shutDownProjectEC2Instance = require("../utils/rce/shutDownEC2Instance");
			await shutDownProjectEC2Instance(runningProjectDocInDB.machineId);
		}
		await runningProjectDocInDB.delete();

		const { PROJECT_SHUT_DOWN } = require("../../common/socketTypes");
		sendMessageToProjectSocketRoom(projectId, PROJECT_SHUT_DOWN, {});

		return res.json({ message: "Project Shut Down Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports.triggerProjectAppRestart = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is actually running on an EC2 server.
		const RunningProject = require("../../common/db/models/RunningProject");
		const runningProjectDocInDB = await RunningProject.findOne({ projectId });

		if (!runningProjectDocInDB)
			return res.status(400).json({ message: "Project is not running" });

		if (!runningProjectDocInDB.machineId)
			return res
				.status()
				.json({ message: "Project has not yet been initialized." });

		const { TRIGGER_SERVER_RESTART } = require("../../common/socketTypes");
		sendMessageToProjectAppRunner(projectId, TRIGGER_SERVER_RESTART, {});

		return res.json({ message: "Project App Restart Triggered Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

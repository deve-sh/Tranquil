const fse = require("fs-extra");

const Project = require("../../common/db/models/Project");

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

		if (runningProjectDocInDB)
			return res.json({
				message: "Project is already running",
				publicIP: runningProjectDocInDB.publicIP,
				publicURL: runningProjectDocInDB.publicURL,
			});

		const createProjectEC2Instance = require("../utils/rce/createProjectEC2Instance");
		const { data: instance, error: errorCreatingInstance } =
			await createProjectEC2Instance();
		if (errorCreatingInstance)
			return res.status(500).send({ error: errorCreatingInstance.message });

		const copyFilesAndStartAppOnInstance = require("../utils/rce/copyFilesAndStartAppOnInstance");
		const { template } = projectFromDatabase;
		const { error: errorStartingApp } = await copyFilesAndStartAppOnInstance(
			projectId,
			template,
			instance
		);

		if (errorStartingApp) {
			const shutDownProjectEC2Instance = require("../utils/rce/shutDownEC2Instance");
			await shutDownProjectEC2Instance(instance.InstanceId);
			return res.status(500).send({ error: errorStartingApp.message });
		}

		// Save this project's status in DB
		const newProjectRunningDoc = new RunningProject({
			publicIP: instance.PublicIpAddress,
			publicURL: instance.PublicDnsName,
			projectId,
			machineId: instance.InstanceId,
			instanceMetaData: instance, // For any arising use case later
		});
		await newProjectRunningDoc.save();
		return res.json({
			message: "Project initialized successfully",
			publicIP: instance.PublicIpAddress,
			publicURL: instance.PublicDnsName,
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

		// Check if project is actually running on an EC2 server.
		const RunningProject = require("../../common/db/models/RunningProject");
		const runningProjectDocInDB = await RunningProject.findOne({ projectId });

		if (!runningProjectDocInDB || !runningProjectDocInDB.machineId)
			return res.json({ message: "Project is already shut down" });

		const shutDownProjectEC2Instance = require("../utils/rce/shutDownEC2Instance");

		await shutDownProjectEC2Instance(runningProjectDocInDB.machineId);
		await runningProjectDocInDB.delete();

		return res.json({ message: "Project Shut Down Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

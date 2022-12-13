const { execSync } = require("child_process");
const fse = require("fs-extra");
const path = require("path");

const getAllFilesForProject = require("../../../common/operations/getAllFilesForProject");
const generateRandomPortNumber = require("../utils/generateRandomPortNumber");
const isProjectRunningOnServer = require("../utils/isProjectRunningOnServer");

const initializeProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is already running on server.
		const isProjectAlreadyRunning = await isProjectRunningOnServer(projectId);
		if (isProjectAlreadyRunning)
			return res.json({ message: "Project is already running on server." });

		const projectFolderPath = path.resolve(
			process.cwd(),
			"../running-projects/" + projectId
		);
		const projectFiles = await getAllFilesForProject(projectId);
		if (projectFiles.length) {
			const fileCreationPromises = [];
			for (let file of projectFiles) {
				fileCreationPromises.push(
					fse.outputFile(
						path.resolve(projectFolderPath, file.path),
						file.contents
					)
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
				`cd ${projectFolderPath} && npm install && PORT=${portForProject} npm run dev`,
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

module.exports = initializeProject;

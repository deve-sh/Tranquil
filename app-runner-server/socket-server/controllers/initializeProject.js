const fse = require("fs-extra");
const path = require("path");

const getAllFilesForProject = require("../../../common/operations/getAllFilesForProject");
const isProjectRunningOnServer = require("../utils/isProjectRunningOnServer");

const initializeProject = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Check if project is already running on server.
		const isProjectAlreadyRunning = await isProjectRunningOnServer(projectId);
		console.log({ isProjectAlreadyRunning });
		if (isProjectAlreadyRunning)
			return res.json({ message: "Project is already running on server." });

		const projectFiles = await getAllFilesForProject(projectId);
		if (projectFiles.length) {
			const fileCreationPromises = [];
			for (let file of projectFiles) {
				fileCreationPromises.push(
					fse.outputFile(
						path.resolve(
							process.cwd(),
							`../running-projects/${projectId}/${file.path}`
						),
						file.contents
					)
				);
			}
			await Promise.all(fileCreationPromises);
		}
		return res.json({ message: "Project Initialized Successfully." });
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message, error: "Internal Server Error" });
	}
};

module.exports = initializeProject;

const copyFilesAndStartAppOnInstance = async (
	projectId,
	template,
	instance
) => {
	try {
		const sendMessageToProjectSocketRoom = require("../../socket/sendMessageToProjectSocketRoom");
		const getTemplateInfo = require("../getTemplateInfo");
		const templateInfo = getTemplateInfo(template);
		const { installCommand, startCommand } = templateInfo;

		if (templateInfo.deprecated)
			return { error: new Error("Project template no longer supported.") };

		const { PROJECT_INIT_UPDATE } = require("../../../common/socketTypes");
		const { NodeSSH } = require("node-ssh");
		const fse = require("fs-extra");

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "copying-files-to-instance",
		});
		const ssh = new NodeSSH();
		await ssh.connect({
			host: instance.PublicIpAddress,
			username: "ec2-user",
			privateKey: process.env.AWS_EC2_RUNNER_SSH_KEY_CONTENT,
		});

		// SSH Connection established, now copy files for the project to the instance.
		const getAllFilesForProject = require("../../../common/operations/getAllFilesForProject");
		const projectFiles = await getAllFilesForProject(projectId);

		if (!projectFiles.length)
			return { error: new Error("No files present in the project") };

		// Run Git Clone to get app-runner files.
		await ssh.execCommand(`git clone ${process.env.REPO_GITHUB_CLONE_PATH} ./`);

		// Project files to copy.
		const filesToCopy = [];
		const fileCreationPromises = [];
		for (const file of projectFiles) {
			// Create these project files on the server temporarily
			const fileTempPath = "/temp/" + projectId + file.path;
			const fileOnRunnerServerMatchingPath = "project-app/" + file.path;

			fileCreationPromises.push(fse.outputFile(fileTempPath, file.contents));
			filesToCopy.push({
				local: fileTempPath,
				remote: fileOnRunnerServerMatchingPath,
			});
		}
		await Promise.all(fileCreationPromises);
		await ssh.putFiles(filesToCopy);

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "copied-files-to-instance",
		});

		// Delete temporary files
		const fileDeletionPromises = filesToCopy.map((file) =>
			fse.unlink(file.local)
		);
		await Promise.all(fileDeletionPromises);

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "triggering-app-processes",
		});

		// Run the app just created on the remote runner server.
		// via the app-runner we copied to the instance.
		await ssh.execCommand("npm install"); // Install dependencies for the app-runner
		await ssh.execCommand(
			`node ./app-runner.js "${projectId}" "${installCommand}" "${startCommand}"`
		);

		return {};
	} catch (error) {
		return { error };
	}
};

module.exports = copyFilesAndStartAppOnInstance;

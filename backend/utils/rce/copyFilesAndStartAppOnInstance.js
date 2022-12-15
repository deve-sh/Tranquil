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

		const filesToCopy = [];
		const fileCreationPromises = [];
		for (const file of projectFiles) {
			// Create files temporarily
			const fileTempPath = "/temp/" + projectId + file.path;
			const fileOnRunnerServerMatchingPath = file.path;

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

		// Install node.js on the instance.
		const execCommandOptions = {
			onStdout: (out) => console.log(out.toString()),
			onStderr: (err) => console.error(err.toString()),
		};

		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			step: "triggering-app-processes",
		});

		// Install dependencies, run the app just created on the remote runner server.
		await ssh.execCommand(installCommand, execCommandOptions);
		ssh.execCommand(startCommand, execCommandOptions);

		return {};
	} catch (error) {
		return { error };
	}
};

module.exports = copyFilesAndStartAppOnInstance;

const startAppOnInstance = async (projectId, template, instance) => {
	try {
		const sendMessageToProjectSocketRoom = require("../../socket/sendMessageToProjectSocketRoom");
		const generateEnvVarSetterCommandsForProject = require("./generateEnvVarSetterCommandsForProject");
		const sshCommandOutputStreamerConfig = require("./sshOutputStream");
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
			privateKey: require("./ssh-key"),
		});

		// SSH Connection established, now copy files for the project to the instance.
		const getAllFilesForProject = require("../../../common/operations/getAllFilesForProject");
		const projectFiles = await getAllFilesForProject(projectId);

		if (!projectFiles.length)
			return { error: new Error("No files present in the project") };

		// Run Git Clone to get app-runner files.
		await ssh.execCommand(
			`git clone ${process.env.REPO_GITHUB_CLONE_PATH} ./repo`,
			sshCommandOutputStreamerConfig(projectId)
		);
		// Copy .env file from app-runner directory to app-runner on ec2 instance
		const path = require("path");
		await ssh.putFile(
			path.resolve(process.cwd(), "../app-runner/.env"),
			"repo/app-runner/.env"
		);

		// Project files to copy.
		const filesToCopy = [];
		const fileCreationPromises = [];
		for (const file of projectFiles) {
			// Create these project files on the server temporarily
			const fileTempPath = path.resolve(
				"../temp/" + projectId + "/",
				file.path
			);
			const fileOnRunnerServerMatchingPath =
				"repo/app-runner/project-app/" + file.path;

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

		// Expose Environment variables for the project in the instance set by the user
		const envVarSetterCommands = await generateEnvVarSetterCommandsForProject(
			projectId
		);
		if (envVarSetterCommands.length) {
			sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
				step: "setting-env-vars-to-instance",
			});
			for (const command of envVarSetterCommands)
				await ssh.execCommand(command);
			sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
				step: "completed-setting-env-vars-to-instance",
			});
		}

		// Run the app just created on the remote runner server.
		// via the app-runner we copied to the instance.
		ssh.execCommand(
			`cd repo/app-runner && nvm use 16.10.0 && npm install && node ./index.js "${projectId}" "${installCommand}" "${startCommand}"`,
			sshCommandOutputStreamerConfig(projectId)
		);

		return {};
	} catch (error) {
		console.log(error);
		return { error };
	}
};

module.exports = startAppOnInstance;

const copyFilesAndStartAppOnInstance = async (
	projectId,
	template,
	instance
) => {
	try {
		let installCommand, startCommand;
		try {
			const getTemplateInfo = require("../getTemplateInfo");
			const templateInfo = getTemplateInfo(template);

			installCommand = templateInfo.installCommand;
			startCommand = templateInfo.startCommand;
		} catch {
			return res.status(400).json({ error: "Invalid or unsupported project." });
		}

		const { NodeSSH } = require("node-ssh");
		const fse = require("fs-extra");

		const ssh = new NodeSSH();
		await ssh.connect({
			host: instance.PublicDnsName,
			username: "root",
			privateKeyPath: Buffer.from(process.env.AWS_EC2_RUNNER_SSH_KEY_CONTENT),
		});

		// SSH Connection established, now copy files for the project to the instance.
		const getAllFilesForProject = require("../../common/operations/getAllFilesForProject");
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

		// Delete temporary files
		const fileDeletionPromises = filesToCopy.map((file) =>
			fse.unlink(file.local)
		);
		await Promise.all(fileDeletionPromises);

		// Install dependencies, run the app directory just created on the remote runner server.
		const installCommandOutput = await ssh.exec(installCommand);
		const startCommandOutput = await ssh.exec(startCommand);

		return { data: { installCommandOutput, startCommandOutput } };
	} catch (error) {
		return { error };
	}
};

module.exports = copyFilesAndStartAppOnInstance;

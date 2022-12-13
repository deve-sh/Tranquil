const getRunningProjectPath = require("./getRunningProjectPath");

const spawnAppProcess = ({
	projectId,
	installCommand,
	startCommand,
	environmentVars,
	onDataStream,
	onErrorStream,
}) => {
	const { spawn } = require("child_process");
	const projectFolderPath = getRunningProjectPath(projectId);
	const child = spawn(
		`cd ${projectFolderPath} && ${installCommand} && ${startCommand}`,
		[],
		{ shell: true, env: environmentVars }
	);
	child.stdout.on("data", onDataStream);
	child.stderr.on("data", onErrorStream);
	return child;
};

module.exports = spawnAppProcess;

const waitOn = require("wait-on");
const { spawn } = require("child_process");

const broadcastToProjectSocket = require("./broadcastToProjectSocket");
const { PROJECT_INSTANCE_STATES } = require("../common/socketTypes");

let appRunningProcess;

const spawnAppServer = ({ command, projectId, socket }) => {
	// Spawn app install and runner processes.
	appRunningProcess = spawn(command, { shell: true });
	appRunningProcess.stdout.on("data", (data) => {
		const logString = data.toString().trim();
		if (logString.length) {
			// Send to server via socket for it to broadcast to project clients.
			broadcastToProjectSocket(socket, projectId, {
				type: PROJECT_INSTANCE_STATES.STDOUT,
				log: logString,
			});
		}
	});

	appRunningProcess.stderr.on("data", (data) => {
		const logString = data.toString();
		if (logString.trim().length) {
			// Send to server via socket for it to broadcast to project clients.
			broadcastToProjectSocket(socket, projectId, {
				type: PROJECT_INSTANCE_STATES.STDERR,
				log: logString,
			});
		}
	});

	appRunningProcess.on("close", (code, signal) => {
		if (code || signal) {
			// Errored Exit
			broadcastToProjectSocket(socket, projectId, {
				state: PROJECT_INSTANCE_STATES.CRASHED,
				code: code || signal,
			});
		} else {
			// Clean Exit
			broadcastToProjectSocket(socket, projectId, {
				state: PROJECT_INSTANCE_STATES.STOPPED,
			});
		}
	});

	const tenMinutes = 10 * 60 * 1000;
	const waitOnOptions = {
		resources: ["http://localhost:3000"],
		timeout: tenMinutes,
	};

	waitOn(waitOnOptions, (err) => {
		if (err)
			return broadcastToProjectSocket(socket, projectId, {
				state: PROJECT_INSTANCE_STATES.CRASHED,
				error: "Project took too long to respond",
			});
		broadcastToProjectSocket(socket, projectId, {
			state: PROJECT_INSTANCE_STATES.READY,
		});
	});

	return appRunningProcess;
};

module.exports = spawnAppServer;

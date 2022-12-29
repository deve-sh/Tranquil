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
				type: PROJECT_INSTANCE_STATES.CRASHED,
				code,
			});
		} else {
			// Clean Exit
			broadcastToProjectSocket(socket, projectId, {
				type: PROJECT_INSTANCE_STATES.STOPPED,
			});
		}
	});

	const fiveMinutes = 5 * 60 * 1000;
	const waitOnOptions = {
		resources: ["http://localhost:3000"],
		timeout: fiveMinutes,
	};

	waitOn(waitOnOptions, (err) => {
		if (err)
			return broadcastToProjectSocket(socket, projectId, {
				state: PROJECT_INSTANCE_STATES.CRASHED,
			});
		broadcastToProjectSocket(socket, projectId, {
			state: PROJECT_INSTANCE_STATES.READY,
		});
	});

	return appRunningProcess;
};

module.exports = spawnAppServer;

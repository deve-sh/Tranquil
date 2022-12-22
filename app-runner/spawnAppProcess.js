const waitOn = require("wait-on");
const { spawn } = require("child_process");

const {
	BROADCAST_TO_PROJECT,
	PROJECT_INSTANCE_STATES,
} = require("../common/socketTypes");

let appRunningProcess;

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;

const spawnAppServer = ({ command, projectId, socket }) => {
	// Spawn app install and runner processes.
	appRunningProcess = spawn(command, { shell: true });
	appRunningProcess.stdout.on("data", (data) => {
		const logString = data.toString().trim();
		if (logString.length) {
			// Send to server via socket for it to broadcast to project clients.
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret,
				data: { type: PROJECT_INSTANCE_STATES.STDOUT, log: logString },
			});
		}
	});

	appRunningProcess.stderr.on("data", (data) => {
		const logString = data.toString();
		if (logString.trim().length) {
			// Send to server via socket for it to broadcast to project clients.
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret,
				data: { type: PROJECT_INSTANCE_STATES.STDERR, log: logString },
			});
		}
	});

	appRunningProcess.on("close", (code, signal) => {
		if (code || signal) {
			// Errored Exit
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret,
				data: { type: PROJECT_INSTANCE_STATES.CRASHED, code },
			});
		} else {
			// Clean Exit
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret,
				data: { type: PROJECT_INSTANCE_STATES.STOPPED },
			});
		}
	});

	const waitOnOptions = {
		resources: ["http://localhost:3000"],
		timeout: 60000,
	};

	waitOn(waitOnOptions, (err) => {
		if (err)
			return socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret,
				data: { type: PROJECT_INSTANCE_STATES.CRASHED },
			});
		socket.emit(BROADCAST_TO_PROJECT, {
			projectId,
			broadCastSecret,
			data: { type: PROJECT_INSTANCE_STATES.READY },
		});
	});

	return appRunningProcess;
};

module.exports = spawnAppServer;

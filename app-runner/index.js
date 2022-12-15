// Script for running an app on an EC2 Instance/Docker Container
// Syntax for invocation: node ./index.js "projectId" "installCommand?" "startCommand?"

require("dotenv").config();

const { spawn } = require("child_process");
const { io } = require("socket.io-client");

const {
	BROADCAST_TO_PROJECT,
	PROJECT_INSTANCE_STATES,
} = require("../common/socketTypes");

const projectId = process.argv[2] || "";
const installCommand = process.argv[3] || "npm install";
const startCommand = process.argv[4] || "npm run start";

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;

if (projectId && installCommand && startCommand && broadCastSecret) {
	const socket = io(process.env.MAIN_BACKEND_URL);

	socket.on("connect", () => {
		// Connected to backend via socket.
		// Spawn app install and runner processes.
		const appRunningProcess = spawn(
			`cd ./app && ${installCommand} && ${startCommand}`,
			{ shell: true }
		);
		appRunningProcess.stdout.on("data", (data) => {
			const logString = data.toString().trim();
			if (logString.length) {
				// Send to server via socket for it to broadcast to project clients.
				socket.emit(BROADCAST_TO_PROJECT, {
					projectId,
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
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
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
					data: { type: PROJECT_INSTANCE_STATES.STDERR, log: logString },
				});
			}
		});

		appRunningProcess.on("close", (code, signal) => {
			if (code || signal) {
				// Errored Exit
				socket.emit(BROADCAST_TO_PROJECT, {
					projectId,
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
					data: { type: PROJECT_INSTANCE_STATES.CRASHED, code },
				});
			} else {
				// Clean Exit
				socket.emit(BROADCAST_TO_PROJECT, {
					projectId,
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
					data: { type: PROJECT_INSTANCE_STATES.STOPPED },
				});
			}
		});

		// todo: Add project file updation related socket event as well.
	});
}

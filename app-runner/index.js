// Script for running an app on an EC2 Instance/Docker Container
// Syntax for invocation: node ./index.js "projectId" "installCommand?" "startCommand?"

require("dotenv").config();

const { spawn } = require("child_process");
const { io } = require("socket.io-client");
const fse = require("fs-extra");

const {
	BROADCAST_TO_PROJECT,
	PROJECT_INSTANCE_STATES,
	PROJECT_APP_RUNNER_SOCKET,
	FILE_UPDATED,
} = require("../common/socketTypes");

const projectId = process.argv[2] || "";
const installCommand = process.argv[3] || "npm install";
const startCommand = process.argv[4] || "npm run start";

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;

if (projectId && installCommand && startCommand && broadCastSecret) {
	const socket = io(process.env.MAIN_BACKEND_URL);

	socket.on("connect", () => {
		// Connected to backend via socket.

		// Send initialized status to socket server.
		socket.emit(PROJECT_APP_RUNNER_SOCKET, { projectId });

		// Spawn app install and runner processes.
		const appRunningProcess = spawn(
			`cd ./project-app && ${installCommand} && ${startCommand}`,
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

		socket.on(FILE_UPDATED, (event) => {
			const { operation, newContent, path } = event;
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
				data: {
					type: PROJECT_INSTANCE_STATES.STDOUT,
					log: "File update op received: " + JSON.stringify(event),
				},
			});
			try {
				if (operation === "delete") fse.unlink(`./project-app/${path}`);
				else fse.writeFile(`./project-app/${path}`, newContent);
				socket.emit(BROADCAST_TO_PROJECT, {
					projectId,
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
					data: {
						type: PROJECT_INSTANCE_STATES.STDOUT,
						log: "File update op done: " + JSON.stringify(event),
					},
				});
			} catch (err) {
				socket.emit(BROADCAST_TO_PROJECT, {
					projectId,
					broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
					data: {
						type: PROJECT_INSTANCE_STATES.STDERR,
						log: "File update failed: " + err.message,
					},
				});
			}
		});
	});
}

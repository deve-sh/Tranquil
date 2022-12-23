// Script for running an app on an EC2 Instance/Docker Container
// Syntax for invocation: node ./index.js "projectId" "installCommand?" "startCommand?"

require("dotenv").config();

const { io } = require("socket.io-client");
const fse = require("fs-extra");
const { resolve } = require("path");

const {
	BROADCAST_TO_PROJECT,
	PROJECT_INSTANCE_STATES,
	PROJECT_APP_RUNNER_SOCKET,
	FILE_UPDATED,
	TRIGGER_SERVER_RESTART,
} = require("../common/socketTypes");

const spawnAppProcess = require("./spawnAppProcess");
const killProcess = require("./killProcess");

const projectId = process.argv[2] || "";
const installCommand = process.argv[3] || "npm install";
const startCommand = process.argv[4] || "npm run start";

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;

let currentlyRunningAppProcess;

if (projectId && installCommand && startCommand && broadCastSecret) {
	const socket = io(process.env.MAIN_BACKEND_URL);

	socket.on("connect", () => {
		// Connected to backend via socket.

		// Send initialized status to socket server.
		socket.emit(PROJECT_APP_RUNNER_SOCKET, { projectId });

		// Spawn app install and runner processes.
		const appRunningCommand = `cd ./project-app && ${installCommand} && ${startCommand}`;
		currentlyRunningAppProcess = spawnAppProcess({
			command: appRunningCommand,
			socket,
			projectId,
		});

		socket.on(FILE_UPDATED, (event) => {
			const { operation, newContent, path } = event;
			try {
				if (operation === "delete") fse.unlink(resolve("./project-app/", path));
				else fse.writeFile(resolve("./project-app/", path), newContent);
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

		socket.on(TRIGGER_SERVER_RESTART, () => {
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
				data: {
					type: PROJECT_INSTANCE_STATES.STDOUT,
					log: "Re-installing dependencies and restarting server",
				},
			});
			socket.emit(BROADCAST_TO_PROJECT, {
				projectId,
				broadCastSecret: process.env.PROJECT_SOCKET_BROADCAST_SECRET,
				data: {
					state: PROJECT_INSTANCE_STATES.RESTARTING,
				},
			});
			killProcess(currentlyRunningAppProcess.pid.toString());
			currentlyRunningAppProcess = spawnAppProcess({
				command: appRunningCommand,
				socket,
				projectId,
			});
		});
	});
}

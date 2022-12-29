// Script for running an app on an EC2 Instance/Docker Container
// Syntax for invocation: node ./index.js "projectId" "installCommand?" "startCommand?"

require("dotenv").config();

const { io } = require("socket.io-client");
const fse = require("fs-extra");
const { resolve } = require("path");

const {
	PROJECT_INSTANCE_STATES,
	PROJECT_APP_RUNNER_SOCKET,
	FILE_UPDATED,
	TRIGGER_SERVER_RESTART,
	PROJECT_HTTPS_TUNNEL_CREATED,
} = require("../common/socketTypes");

const spawnAppProcess = require("./spawnAppProcess");
const killProcess = require("./killProcess");
const createHTTPSTunnel = require("./createHTTPSTunnel");
const broadcastToProjectSocket = require("./broadcastToProjectSocket");

const projectId = process.argv[2] || "";
const installCommand = process.argv[3] || "npm install";
const startCommand = process.argv[4] || "npm run start";

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;
const ngrokHTTPSTunnelAuthToken = process.env.NGROK_AUTH_TOKEN;

let currentlyRunningAppProcess;

if (
	projectId &&
	installCommand &&
	startCommand &&
	broadCastSecret &&
	ngrokHTTPSTunnelAuthToken
) {
	try {
		const socket = io(process.env.MAIN_BACKEND_URL);

		socket.on("connect", async () => {
			// Connected to backend via socket.
			// Send initialized status to socket server.
			socket.emit(PROJECT_APP_RUNNER_SOCKET, { projectId });

			// Create HTTPS Tunnel and send it to frontend to connect to over HTTPS
			const { url: httpsTunnelURL, error: errorCreatingHTTPSTunnel } =
				await createHTTPSTunnel();

			if (errorCreatingHTTPSTunnel)
				return broadcastToProjectSocket(socket, projectId, {
					state: PROJECT_INSTANCE_STATES.CRASHED,
					error: errorCreatingHTTPSTunnel.message || "Failed to create tunnel.",
				});
			broadcastToProjectSocket(socket, projectId, {
				type: PROJECT_HTTPS_TUNNEL_CREATED,
				url: httpsTunnelURL,
			});

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
					if (operation === "delete")
						fse.unlink(resolve("./project-app/", path));
					else fse.writeFile(resolve("./project-app/", path), newContent);
				} catch (err) {
					broadcastToProjectSocket(socket, projectId, {
						type: PROJECT_INSTANCE_STATES.STDERR,
						log: "File update failed: " + err.message,
					});
				}
			});

			socket.on(TRIGGER_SERVER_RESTART, () => {
				broadcastToProjectSocket(socket, projectId, {
					type: PROJECT_INSTANCE_STATES.STDOUT,
					log: "Re-installing dependencies and restarting server",
				});
				broadcastToProjectSocket(socket, projectId, {
					state: PROJECT_INSTANCE_STATES.RESTARTING,
				});
				killProcess(currentlyRunningAppProcess.pid.toString());
				currentlyRunningAppProcess = spawnAppProcess({
					command: appRunningCommand,
					socket,
					projectId,
				});
			});
		});
	} catch (err) {
		fse.writeFileSync("errorlog", JSON.stringify(err.message));
		return broadcastToProjectSocket(socket, projectId, {
			state: PROJECT_INSTANCE_STATES.CRASHED,
			error: err.message,
		});
	}
}

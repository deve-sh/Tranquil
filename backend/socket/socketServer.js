const { server: expressServer } = require("../express-server");

const socketIO = require("socket.io");

const {
	LISTEN_TO_PROJECT,
	BROADCAST_TO_PROJECT,
	PROJECT_APP_RUNNER_SOCKET,
	STOP_LISTENING_TO_PROJECT,
} = require("../../common/socketTypes");

const getProjectSocketRoomId = require("./utils/getProjectSocketRoomId");
const getAppRunnerSocketRoomId = require("./utils/getAppRunnerSocketRoomId");

const socketServer = socketIO(expressServer, {
	cors: { origin: "*" },
});

socketServer.on("connection", (client) => {
	client.on(LISTEN_TO_PROJECT, (event) => {
		if (!event || !event.projectId) return;
		// Make the device socket connection join a room specific to this project id.
		// This will be used to broadcast project specific logs and updates in real-time
		client.join(getProjectSocketRoomId(event.projectId));
	});

	client.on(STOP_LISTENING_TO_PROJECT, (event) => {
		if (!event || !event.projectId) return;
		client.leave(getProjectSocketRoomId(event.projectId));
	});

	client.on(BROADCAST_TO_PROJECT, (event) => {
		// This is mainly for the app runner script from EC2 Instance/Docker Container to send logs
		// and signals to clients subscribing to the project's updates.
		if (
			!event ||
			!event.projectId ||
			!event.broadCastSecret ||
			event.broadCastSecret !== process.env.PROJECT_SOCKET_BROADCAST_SECRET ||
			!event.data ||
			typeof event.data !== "object"
		)
			return;
		const sendMessageToProjectSocketRoom = require("./sendMessageToProjectSocketRoom");
		sendMessageToProjectSocketRoom(event.projectId, BROADCAST_TO_PROJECT, {
			data: event.data,
		});
	});

	client.on(PROJECT_APP_RUNNER_SOCKET, (event) => {
		if (!event || !event.projectId) return;
		client.join(getAppRunnerSocketRoomId(event.projectId));
	});

	client.on("end", () => client.disconnect(0));

	client.adapter.on("leave-room", async (roomId) => {
		const isProjectSocketRoomId = require("./utils/isProjectSocketRoomId");
		if (!isProjectSocketRoomId(roomId)) return;

		// Get how many sockets are left in the room.
		const socketsInRoom = await socketServer.in(roomId).fetchSockets();

		if (!socketsInRoom.length) {
			// No connections left to the room. Shut the instance down and delete mongodb document for it.
			// Use the inbuilt controller function to make the request.
			const mockSelfRequest = require("../utils/mockSelfRequest");
			const getProjectIdFromSocketRoom = require("./utils/getProjectIdFromSocketRoom");
			const { shutDownProject } = require("../controllers/rce");

			const requestParams = { projectId: getProjectIdFromSocketRoom(roomId) };
			mockSelfRequest(shutDownProject, { params: requestParams });
		}
	});
});

module.exports = socketServer;

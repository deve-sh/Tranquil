const { server: expressServer } = require("../express-server");

const socketIO = require("socket.io");

const {
	LISTEN_TO_PROJECT,
	BROADCAST_TO_PROJECT,
	PROJECT_APP_RUNNER_SOCKET,
} = require("../../common/socketTypes");

const socketServer = socketIO(expressServer, {
	cors: { origin: "*" },
});

socketServer.on("connection", (client) => {
	client.on(LISTEN_TO_PROJECT, (event) => {
		if (!event || !event.projectId) return;
		// Make the device socket connection join a room specific to this project id.
		// This will be used to broadcast project specific logs and updates in real-time
		const getProjectSocketRoomId = require("./utils/getProjectSocketRoomId");
		client.join(getProjectSocketRoomId(event.projectId));
		console.log("Joined client:", client.id, "to project", event.projectId);
	});

	client.on(BROADCAST_TO_PROJECT, (event) => {
		// This is mainly for the app runner script from EC2 Instance/Docker Container to send logs
		// and signals to clients subscribing to the project's updates.
		if (
			!event ||
			!event.projectId ||
			!event.broadCastSecret ||
			!event.broadCastSecret === process.env.PROJECT_SOCKET_BROADCAST_SECRET ||
			!event.data ||
			!typeof event.data === "object"
		)
			return;
		socketServer.to(
			getProjectSocketRoomId(event.projectId),
			BROADCAST_TO_PROJECT,
			event.data
		);
	});

	client.on(PROJECT_APP_RUNNER_SOCKET, (event) => {
		if (!event || !event.projectId) return;
		client.join(event.projectId + "-app-runner-updates");
	});

	client.on("disconnecting", async () => {
		const roomsForClient = client.rooms;
		if (!roomsForClient.size) return;

		// Check how many users are listening to each project room.
		// If after disconnecting from the room, the number of connections to it are 0
		// then shut down the instance the project is running on.
		const isProjectSocketRoomId = require("./utils/isProjectSocketRoomId");
		const projectRoomIds = Array.from(roomsForClient).filter(
			isProjectSocketRoomId
		);

		if (!projectRoomIds.length) return;

		const roomsSocketListPromises = [];
		for (const room of projectRoomIds)
			roomsSocketListPromises.push(socketServer.in(room).fetchSockets());

		const roomsSocketList = await Promise.all(roomsSocketListPromises);
		for (let i = 0; i < projectRoomIds.length; i++) {
			const projectRoomId = projectRoomIds[i];
			const nConnectionsToRoom = roomsSocketList[i];

			if (!nConnectionsToRoom.length) {
				// No connections left to the room. Shut the instance down and delete mongodb document for it.
				// Use the inbuilt controller function to make the request.
				const { shutDownProject } = require("../controllers/rce");
				const mockSelfRequest = require("../utils/mockSelfRequest");
				const getProjectIdFromSocketRoom = require("./utils/getProjectIdFromSocketRoom");

				mockSelfRequest(shutDownProject, {
					params: { projectId: getProjectIdFromSocketRoom(projectRoomId) },
				});
			}
		}
	});

	client.on("end", () => client.disconnect(0));
});

module.exports = socketServer;

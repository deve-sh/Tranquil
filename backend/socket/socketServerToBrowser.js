const { server: expressServer } = require("../express-server");

const socketIO = require("socket.io");

const { LISTEN_TO_PROJECT, BROADCAST_TO_PROJECT } = require("./types");

const socketServerToBrowser = socketIO(expressServer, {
	cors: { origin: "*" },
});

socketServerToBrowser.on("connection", (client) => {
	client.on(LISTEN_TO_PROJECT, (event) => {
		if (!event || !event.projectId) return;
		// Make the device socket connection join a room specific to this project id.
		// This will be used to broadcast project specific logs and updates in real-time
		client.join(event.projectId);
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
		socketServerToBrowser.to(event.projectId, event.data);
	});
	client.on("end", () => client.disconnect(0));
});

module.exports = socketServerToBrowser;

// Sets up a client to listen and emit events to and from the actual app runner socket server.
const socketClient = require("socket.io-client");
const socketToBrowser = require("./socketToBrowser");

const socketClientForRunner = socketClient(process.env.APP_RUNNER_SERVER);
let socketInstance;

socketClientForRunner.on("connection", (socket) => {
	socketInstance = socket;
	socket.on("project-finished-updating", (event) => {
		// HMR or any other live update technique worked for the server.
		// Signal the client-side to update it.
		if (!event.projectId) return;

		const projectRooms = socketToBrowser.adapter.rooms.get(event.projectId);
		if (!projectRooms || !projectRooms.length) return;

		// Send signal for update to all listening to updates on this project id.
		for (let socketId of projectRooms) {
			const individualSocket = socketToBrowser.sockets.sockets.get(socketId);
			if (!individualSocket) continue;
			individualSocket.emit("refresh-project-iframe");
		}
	});
});

module.exports = { socketClientForRunner, socketInstance };

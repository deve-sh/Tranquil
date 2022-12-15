const { server: expressServer } = require("../express-server");

const socketIO = require("socket.io");
const { LISTEN_TO_PROJECT } = require("./types");

const socketServerToBrowser = socketIO(expressServer, {
	cors: { origin: "*" },
});

socketServerToBrowser.on("connection", (client) => {
	client.on(LISTEN_TO_PROJECT, (event) => {
		if (!event || !event.projectId) return;
		// Make the device socket connection join a room specific to this project id.
		// This will be used to broadcast project specific logs and updates in real-time
		client.join(event.projectId);
	});
	client.on("end", () => client.disconnect(0));
});

module.exports = socketServerToBrowser;

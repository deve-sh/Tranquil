const { server: expressServer } = require("../express-server");

const socketIO = require("socket.io");
const socketServerToBrowser = socketIO(expressServer, {
	cors: { origin: "*" },
});

socketServerToBrowser.on("connection", (client) => {
	client.on("listen-to-project", (event) => {
		if (!event || !event.projectId) return;
		// Make the device socket connection join a socket room specific to this project.
		client.join(event.projectId);
	});
	client.on("end", () => client.disconnect(0));
});

module.exports = socketServerToBrowser;

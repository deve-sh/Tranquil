const { BROADCAST_TO_PROJECT } = require("../common/socketTypes");

const broadCastSecret = process.env.PROJECT_SOCKET_BROADCAST_SECRET;

const broadcastToProjectSocket = (socket, projectId, data) => {
	socket.emit(BROADCAST_TO_PROJECT, {
		projectId,
		broadCastSecret,
		data,
	});
};

module.exports = broadcastToProjectSocket;

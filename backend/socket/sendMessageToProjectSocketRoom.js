const socketServer = require("./socketServer");

const sendMessageToProjectSocketRoom = (projectId, messageId, messagePayload) =>
	socketServer.to(projectId).emit(messageId, messagePayload);

module.exports = sendMessageToProjectSocketRoom;

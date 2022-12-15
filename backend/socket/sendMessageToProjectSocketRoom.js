const socketServerToBrowser = require("./socketServerToBrowser");

const sendMessageToProjectSocketRoom = (projectId, messageId, messagePayload) =>
	socketServerToBrowser.to(projectId).emit(messageId, messagePayload);

module.exports = sendMessageToProjectSocketRoom;

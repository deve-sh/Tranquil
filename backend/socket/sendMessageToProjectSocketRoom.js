const socketServer = require("./socketServer");
const getProjectSocketRoomId = require("./utils/getProjectSocketRoomId");

const sendMessageToProjectSocketRoom = (projectId, messageId, messagePayload) =>
	socketServer
		.to(getProjectSocketRoomId(projectId))
		.emit(messageId, messagePayload);

module.exports = sendMessageToProjectSocketRoom;

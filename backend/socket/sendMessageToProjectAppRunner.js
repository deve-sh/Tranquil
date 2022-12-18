const socketServer = require("./socketServer");
const getAppRunnerSocketRoomId = require("./utils/getAppRunnerSocketRoomId");

const sendMessageToProjectAppRunner = (projectId, messageId, messagePayload) =>
	socketServer
		.to(getAppRunnerSocketRoomId(projectId))
		.emit(messageId, messagePayload);

module.exports = sendMessageToProjectAppRunner;

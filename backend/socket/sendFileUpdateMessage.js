const sendMessageToProjectSocketRoom = require("./sendMessageToProjectSocketRoom");
const sendMessageToProjectAppRunner = require("./sendMessageToProjectAppRunner");

const { FILE_UPDATED } = require("../../common/socketTypes");

const sendFileUpdateMessage = (projectId, fileUpdatePayload) => {
	// Notify App Runner that a file has been updated.
	sendMessageToProjectAppRunner(projectId, FILE_UPDATED, fileUpdatePayload);

	// Send signal that file has been updated to all project connected sockets.
	sendMessageToProjectSocketRoom(projectId, FILE_UPDATED, fileUpdatePayload);
};

module.exports = sendFileUpdateMessage;

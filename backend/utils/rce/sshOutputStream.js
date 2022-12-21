const {
	PROJECT_INSTANCE_STATES,
	PROJECT_INIT_UPDATE,
} = require("../../../common/socketTypes");
const sendMessageToProjectSocketRoom = require("../../socket/sendMessageToProjectSocketRoom");

const sshCommandOutputStreamerConfig = (projectId) => ({
	onStderr: (error) =>
		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			data: {
				type: PROJECT_INSTANCE_STATES.STDOUT,
				log: error.toString(),
			},
		}),
	onStdout: (log) =>
		sendMessageToProjectSocketRoom(projectId, PROJECT_INIT_UPDATE, {
			data: {
				type: PROJECT_INSTANCE_STATES.STDOUT,
				log: log.toString(),
			},
		}),
});

module.exports = sshCommandOutputStreamerConfig;

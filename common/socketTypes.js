module.exports.LISTEN_TO_PROJECT = "listen-to-project";
module.exports.PROJECT_APP_RUNNER_SOCKET = "project-app-runner-initialized";
module.exports.BROADCAST_TO_PROJECT = "broadcast-to-project";

module.exports.PROJECT_INIT_UPDATE = "project-initialization-update";
module.exports.PROJECT_SHUT_DOWN = "project-shut-down";

module.exports.FILE_UPDATED = "file-updated";
module.exports.TRIGGER_SERVER_RESTART = "trigger-server-restart";

// Project Instance Event Types
module.exports.PROJECT_INSTANCE_STATES = {
	STDOUT: "project-instance-stdout",
	STDERR: "project-instance-stderr",
	STOPPED: "project-instance-stopped",
	CRASHED: "project-instance-crashed",
};

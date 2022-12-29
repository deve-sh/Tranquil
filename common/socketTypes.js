module.exports.LISTEN_TO_PROJECT = "listen-to-project";
module.exports.STOP_LISTENING_TO_PROJECT = "stop-listening-to-project";
module.exports.PROJECT_APP_RUNNER_SOCKET = "project-app-runner-initialized";
module.exports.BROADCAST_TO_PROJECT = "broadcast-to-project";

module.exports.PROJECT_INIT_UPDATE = "project-initialization-update";
module.exports.PROJECT_SHUT_DOWN = "project-shut-down";
module.exports.PROJECT_SOCKET_ROOM_JOINED = "project-socket-room-joined";
module.exports.PROJECT_SOCKET_ROOM_REJECTED = "project-socket-room-rejected";
module.exports.PROJECT_HTTPS_TUNNEL_CREATED = "project-https-tunnel-created";

module.exports.FILE_UPDATED = "file-updated";
module.exports.TRIGGER_SERVER_RESTART = "trigger-server-restart";

// Project Instance Event Types
module.exports.PROJECT_INSTANCE_STATES = {
	STDOUT: "project-instance-stdout",
	STDERR: "project-instance-stderr",
	STOPPED: "project-instance-stopped",
	CRASHED: "project-instance-crashed",
	READY: "project-instance-ready",
	RESTARTING: "project-instance-restarting",
};

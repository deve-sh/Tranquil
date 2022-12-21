import socket from "./index";

export const initializeProjectSocket = (projectId: string) =>
	socket.emit("listen-to-project", { projectId });

export const disconnectProjectSocket = (projectId: string) =>
	socket.emit("stop-listening-to-project", { projectId });

const projectSocketEventList = [
	"project-initialization-update",
	"project-shut-down",
	"broadcast-to-project",
];

export const setupProjectEventListeners = (
	onEvent: (event: string, eventPayload: Record<string, any>) => any
) => {
	for (const event of projectSocketEventList)
		socket.on(event, (eventPayload) => onEvent(event, eventPayload));
};

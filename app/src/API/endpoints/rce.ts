const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const initializeProjectRCEEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/rce/initialize/${projectId}/`;

export const shutdownProjectRCEEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/rce/shutdown/${projectId}/`;

export const restartProjectServerEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/rce/restart-app-server/${projectId}/`;

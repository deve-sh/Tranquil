const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createProjectEndpoint = `${BACKEND_URL}/api/projects/`;

export const getUserProjectsEndpoint = `${BACKEND_URL}/api/projects/list`;

export const getProjectInfoEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/projects/${projectId}`;

export const updateProjectEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/projects/${projectId}/`;

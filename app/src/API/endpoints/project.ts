export const createProjectEndpoint = `${
	import.meta.env.VITE_BACKEND_URL
}/api/projects/`;

export const getUserProjectsEndpoint = `${
	import.meta.env.VITE_BACKEND_URL
}/api/projects/`;

export const getProjectInfoEndpoint = (projectId: string) =>
	`${import.meta.env.VITE_BACKEND_URL}/api/projects/${projectId}`;

export const updateProjectEndpoint = (projectId: string) =>
	`${import.meta.env.VITE_BACKEND_URL}/api/projects/${projectId}/`;

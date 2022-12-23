const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getProjectFileListEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/files/${projectId}/`;

export const getProjectFileContentsEndpoint = (
	projectId: string,
	fileId: string
) => `${BACKEND_URL}/api/files/${projectId}/${fileId}/`;

export const updateProjectFileEndpoint = (projectId: string, fileId: string) =>
	`${BACKEND_URL}/api/files/${projectId}/${fileId}/`;

export const createProjectFileEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/files/${projectId}/`;

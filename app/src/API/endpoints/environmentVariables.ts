const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getProjectEnvVarsEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/variables/${projectId}`;

export const addProjectEnvVarEndpoint = (projectId: string) =>
	`${BACKEND_URL}/api/variables/${projectId}/`;

export const updateProjectEnvVarEndpoint = (
	projectId: string,
	variableId: string
) => `${BACKEND_URL}/api/variables/${projectId}/${variableId}/`;

export const removeProjectEnvVarEndpoint = (
	projectId: string,
	variableId: string
) => `${BACKEND_URL}/api/variables/${projectId}/${variableId}/`;

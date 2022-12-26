import {
	getProjectEnvVarsEndpoint,
	addProjectEnvVarEndpoint,
	removeProjectEnvVarEndpoint,
	updateProjectEnvVarEndpoint,
} from "./endpoints/environmentVariables";
import request from "./request";

export const getProjectEnvVars = async (projectId: string) => {
	try {
		const response = await request(getProjectEnvVarsEndpoint(projectId));
		return { error: null, data: response };
	} catch (error: unknown | any | Error) {
		return { error, data: null };
	}
};

export const createProjectEnvVar = async (
	projectId: string,
	data: { key: string; value: string }
) => {
	try {
		const response = await request(addProjectEnvVarEndpoint(projectId), {
			method: "post",
			data,
		});
		return { error: null, data: response };
	} catch (error: unknown | any | Error) {
		return { error, data: null };
	}
};

export const removeProjectEnvVar = async (
	projectId: string,
	variableId: string
) => {
	try {
		const response = await request(
			removeProjectEnvVarEndpoint(projectId, variableId),
			{ method: "delete" }
		);
		return { error: null, data: response };
	} catch (error: unknown | any | Error) {
		return { error, data: null };
	}
};

export const updateProjectEnvVar = async (
	projectId: string,
	variableId: string,
	data: { key: string; value: string }
) => {
	try {
		const response = await request(
			updateProjectEnvVarEndpoint(projectId, variableId),
			{ method: "post", data }
		);
		return { error: null, data: response };
	} catch (error: unknown | any | Error) {
		return { error, data: null };
	}
};

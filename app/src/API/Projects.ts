import request from "./request";

import {
	createProjectEndpoint,
	getUserProjectsEndpoint,
	getProjectInfoEndpoint,
	updateProjectEndpoint,
} from "./endpoints/project";
import { restartProjectServerEndpoint } from "./endpoints/rce";

type CreateProjectInputs = { projectName: string; template: string };
export const createProject = async (projectInputs: CreateProjectInputs) => {
	try {
		const response = await request(createProjectEndpoint, {
			data: projectInputs,
			method: "post",
		});
		return { error: null, data: response };
	} catch (error: unknown | any | Error) {
		return { error, data: null };
	}
};

export const updateProject = async (projectId: string) => {
	try {
		const response = await request(updateProjectEndpoint(projectId), {
			method: "put",
		});
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

export const getUserProjects = async () => {
	try {
		const response = await request(getUserProjectsEndpoint);
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

export const getProjectInfo = async (projectId: string) => {
	try {
		const response = await request(getProjectInfoEndpoint(projectId));
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

export const restartProjectAppServer = async (projectId: string) => {
	try {
		const response = await request(restartProjectServerEndpoint(projectId));
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

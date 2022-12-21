import request from "./request";
import {
	initializeProjectRCEEndpoint,
	restartProjectServerEndpoint,
	shutdownProjectRCEEndpoint,
} from "./endpoints/rce";

export const initializeProjectRCE = async (projectId: string) => {
	try {
		const response = await request(initializeProjectRCEEndpoint(projectId));
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

export const shutdownProjectRCE = async (projectId: string) => {
	try {
		const response = await request(shutdownProjectRCEEndpoint(projectId));
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

export const restartProjectServer = async (projectId: string) => {
	try {
		const response = await request(restartProjectServerEndpoint(projectId));
		return { error: null, data: response };
	} catch (error) {
		return { error, data: null };
	}
};

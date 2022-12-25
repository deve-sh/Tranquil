import request from "./request";

import {
	getProjectFileListEndpoint,
	getProjectFileContentsEndpoint,
	createProjectFileEndpoint,
	updateProjectFileEndpoint,
} from "./endpoints/files";

export const getProjectFileList = async (projectId: string) => {
	try {
		const response = await request(getProjectFileListEndpoint(projectId));
		return { error: null, data: response };
	} catch (error: any | unknown | Error) {
		return { error, data: null };
	}
};

export const getProjectFileContent = async (
	projectId: string,
	fileId: string
) => {
	try {
		const response = await request(
			getProjectFileContentsEndpoint(projectId, fileId)
		);
		return { error: null, data: response };
	} catch (error: any | unknown | Error) {
		return { error, data: null };
	}
};

export const createProjectFile = async (
	projectId: string,
	options: { path: string; contents: string; isReadableContent?: boolean }
) => {
	try {
		const response = await request(createProjectFileEndpoint(projectId), {
			method: "post",
			data: options,
		});
		return { error: null, data: response };
	} catch (error: any | unknown | Error) {
		return { error, data: null };
	}
};

export const updateProjectFile = async (
	projectId: string,
	fileId: string,
	options: { path: string; newContent: string; operation: "update" | "delete" }
) => {
	try {
		const response = await request(
			updateProjectFileEndpoint(projectId, fileId),
			{
				method: "post",
				data: options,
			}
		);
		return { error: null, data: response };
	} catch (error: any | unknown | Error) {
		return { error, data: null };
	}
};

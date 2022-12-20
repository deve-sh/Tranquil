import axios from "axios";

interface RequestOptionsArgs {
	data?: any;
	headers?: Record<string, any>;
	method?: "get" | "post" | "put" | "patch" | "delete";
}

const request = async (
	endpoint: string,
	{ method = "get", headers, data }: RequestOptionsArgs = {}
) => {
	try {
		const response = await axios[method](endpoint, data, { headers });
		return response.data;
	} catch (err: unknown | Error | any) {
		console.log(err);
		const errorMessage =
			err?.response?.data?.error ||
			err?.message ||
			"Something went wrong. Please try again later.";
		throw new Error(errorMessage);
	}
};

export default request;

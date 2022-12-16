const mockSelfRequest = async (
	controllerFunction,
	{ params, body, query } = {}
) => {
	const req = { params: params || {}, body: body || null, query: query || {} };
	const res = {
		data: { status: null, response: null },
		status(statusCode) {
			this.data.status = statusCode;
			return this;
		},
		json(response) {
			this.data.response = response;
			return this;
		},
	};

	// Call controller function with side-effect.
	await controllerFunction(req, res);

	return res.data;
};

module.exports = mockSelfRequest;

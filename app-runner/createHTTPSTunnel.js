const ngrok = require("ngrok");

const createHTTPSTunnel = async (port = 300) => {
	try {
		const url = await ngrok.connect(port);
		return { url };
	} catch (error) {
		return { error };
	}
};

module.exports = createHTTPSTunnel;

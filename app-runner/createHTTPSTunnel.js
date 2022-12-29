const ngrok = require("ngrok");

const createHTTPSTunnel = async (port = 3000) => {
	try {
		await ngrok.disconnect();
		const url = await ngrok.connect(port);
		return { url };
	} catch (error) {
		return { error };
	}
};

module.exports = createHTTPSTunnel;

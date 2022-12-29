const ngrok = require("ngrok");

const createHTTPSTunnel = async (port = 3000) => {
	try {
		// await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
		const url = await ngrok.connect(port);
		return { url };
	} catch (error) {
		return { error };
	}
};

module.exports = createHTTPSTunnel;

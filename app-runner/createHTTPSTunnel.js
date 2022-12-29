const ngrok = require("ngrok");
const fse = require("fs-extra");

const createHTTPSTunnel = async (port = 3000) => {
	try {
		fse.writeFileSync(
			"ngrok.yml",
			`authtoken: ${process.env.NGROK_AUTH_TOKEN}`
		);
		const url = await ngrok.connect({ addr: port, configPath: "./ngrok.yml" });
		return { url };
	} catch (error) {
		return { error };
	}
};

module.exports = createHTTPSTunnel;

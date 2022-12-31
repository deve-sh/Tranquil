const localtunnel = require("localtunnel");
const fetch = require("node-fetch");

const chromeUserAgent =
	"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

const activeHTTPSTunnel = async (tunnelURL) => {
	// Unfortunately, tunnels created by localtunnel have a warning page for users visiting via browsers.
	// So we will go to the tunnel URL using a GET request, extract the endpoint to hit in order to verify the tunnel.
	// And hit that endpoint to ensure the end users do not see the tunnel link.
	const fetchOptions = {
		headers: { "User-Agent": chromeUserAgent },
	};

	const html = await fetch(tunnelURL, fetchOptions).then((response) =>
		response.text()
	);
	const lines = html.split("\n");

	let endpointToHitToActivateTunnel = "";
	const fragmentToLookForInLine = 'url: "/continue/';
	for (const line of lines) {
		if (line.includes(fragmentToLookForInLine)) {
			endpointToHitToActivateTunnel = line
				.split('url: "')
				.pop()
				.replace(/[",]/g, "");
			break;
		}
	}

	const tunnelActivationResp = await fetch(
		tunnelURL + endpointToHitToActivateTunnel,
		fetchOptions
	).then((resp) => resp.json());

	return tunnelActivationResp;
};

const createHTTPSTunnel = async (port = 3000) => {
	try {
		const tunnel = await localtunnel({ port });
		if (!tunnel.url) throw new Error("Failed to create HTTPS tunnel.");

		const tunnelActivationResp = await activeHTTPSTunnel(tunnel.url);
		return { url: tunnel.url, tunnel, tunnelActivationResp };
	} catch (error) {
		console.log(error);
		return { error };
	}
};

module.exports = createHTTPSTunnel;

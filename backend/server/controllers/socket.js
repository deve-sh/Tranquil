const setupSocketControllers = (socketServer) => {
	socketServer.on("connection", (client) => {
		client.on("event", (event) => {
			console.log("Received Event From Client: ", event);
		});
		client.on("disconnect", () =>
			console.log("Disconnected Client: " + client.id)
		);
		client.on("end", () => client.disconnect(0));
	});
};

export default setupSocketControllers;

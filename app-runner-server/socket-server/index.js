require("dotenv").config();

const http = require("http");
const app = require("express")();
const { Server } = require("socket.io");
const cors = require("cors");
const fse = require("fs-extra");

const server = http.createServer(app);

app.use(cors());
app.get("/", (_, res) => res.sendFile(__dirname + "/tryout/index.html"));

// Socket
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
	});
	socket.on("filechange", (data) => {
		if (!data) return;

		const projectId = data.projectId;
		const fileName = data.fileName;
		const newContents = data.newContents;

		if (!projectId || !fileName || !newContents) return;

		fse
			.writeFile(`../running-projects/${projectId}/${fileName}`, newContents)
			.then(() => {
				setTimeout(() => {
					socket.emit("fileupdatesuccess", {
						fileName,
						projectId,
					});
				}, 750);
			})
			.catch((error) => {
				socket.emit("fileupdateerror", error);
			});
	});
});

const PORT = 3000;
server.listen(PORT, () =>
	console.log("Socket Manager Server Running on port: ", PORT)
);

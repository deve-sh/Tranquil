require("dotenv").config();

const http = require("http");
const app = require("express")();
const { Server } = require("socket.io");
const cors = require("cors");
const fse = require("fs-extra");

const server = http.createServer(app);

app.use(cors());
app.get("/", (_, res) => res.sendFile(__dirname + "/tryout/index.html"));

// Controllers and API Routes
const initializeProject = require("./controllers/initializeProject");
const shutdownProject = require("./controllers/shutdownProject");

app.post("/api/initializeproject/:projectId", initializeProject);
app.post("/api/shutdownproject/:projectId", shutdownProject);

// Socket
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	socket.on("filechange", (data) => {
		if (!data) return;

		const { projectId, path, operation, newContent } = data;

		if (!projectId || !path) return;

		if (operation === "delete")
			fse.unlink(`../running-projects/${projectId}/${path}`);
		fse.writeFile(`../running-projects/${projectId}/${path}`, newContent);
	});
});

const PORT = process.env.PORT || 3000;
const setupDatabaseConnection = require("../../common/db");
setupDatabaseConnection().then(() =>
	server.listen(PORT, () =>
		console.log("Socket Manager Server Running on port: ", PORT)
	)
);

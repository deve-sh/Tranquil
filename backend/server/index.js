require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const socket = require("socket.io");
const cors = require("cors");

// Routers
const filesRouter = require("./routes/files");
const projectsRouter = require("./routes/projects");

const app = express();
const server = createServer(app);

// Middlewares
app.use("*", cors());
app.use("*", (req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

// Socket Server and Controllers
const setupSocketControllers = require("./controllers/socket");
const socketServer = socket(server, { cors: { origin: "*" } });
setupSocketControllers(socketServer);

// Routes
app.use("/files", filesRouter);
app.use("/projects", projectsRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("App running at port: ", PORT));

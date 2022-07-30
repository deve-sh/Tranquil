import express from "express";
import { createServer } from "http";
import socket from "socket.io";
import cors from "cors";

// Routers
import filesRouter from "./routes/files";
import projectsRouter from "./routes/projects";

const app = express();
const server = createServer(app);

// Middlewares
app.use("*", cors());
app.use("*", (req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

// Socket Server and Controllers
import setupSocketControllers from "./controllers/socket";
const socketServer = socket(server, { cors: { origin: "*" } });
setupSocketControllers(socketServer);

// Routes
app.use("/files", filesRouter);
app.use("/projects", projectsRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("App running at port: ", PORT));

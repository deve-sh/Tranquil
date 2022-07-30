import express from "express";
import filesRouter from "./routes/files";
import { createServer } from "http";
import socket from "socket.io";
import cors from "cors";

import setupSocketControllers from "./controllers/socket";

const app = express();
const server = createServer(app);
const socketServer = socket(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 8080;

app.use("*", cors());

app.use("*", (req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

setupSocketControllers(socketServer);

app.use("/files", filesRouter);

server.listen(PORT, () => console.log("App running at port: ", PORT));

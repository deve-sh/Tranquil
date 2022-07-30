import express from "express";
import filesRouter from "./routes/files";
import { createServer } from "http";
import socket from "socket.io";

const app = express();
const server = createServer(app);
const socketServer = socket(server);

const PORT = process.env.PORT || 8080;

app.use("*", (req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

app.use("/files", filesRouter);

server.listen(PORT, () => console.log("App running at port: ", PORT));

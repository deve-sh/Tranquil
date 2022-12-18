require("dotenv").config();

const express = require("express");
const cors = require("cors");

const setupMongoDBConnection = require("../common/db");

const { app, server } = require("./express-server");

// Middlewares
app.use("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

// Routers
const filesRouter = require("./routes/files");
const projectsRouter = require("./routes/projects");
const rceRouter = require("./routes/rce");
const envVarsRouter = require("./routes/envVariables");

// Socket Server to Client-side browsers and devices
require("./socket/socketServer");

// Routes
app.use("/api/files", filesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/rce", rceRouter);
app.use("/api/variables", envVarsRouter);

const PORT = process.env.PORT || 8080;
setupMongoDBConnection().then(() =>
	server.listen(PORT, () => console.log("App running at port: ", PORT))
);

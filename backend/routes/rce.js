const { Router } = require("express");
const rceControllers = require("../controllers/rce");

const rceRouter = Router();

rceRouter.post(
	"/initialize/:projectId/local",
	rceControllers.initializeProjectLocally
);
rceRouter.post(
	"/shutdown/:projectId/local",
	rceControllers.shutDownProjectLocally
);

rceRouter.post("/initialize/:projectId", rceControllers.initializeProject);
rceRouter.post("/shutdown/:projectId", rceControllers.shutDownProject);

module.exports = rceRouter;

const { Router } = require("express");
const rceControllers = require("../controllers/rce");

const rceRouter = Router();

rceRouter.get("/initialize/:projectId", rceControllers.initializeProject);
rceRouter.get("/shutdown/:projectId", rceControllers.shutDownProject);

module.exports = rceRouter;

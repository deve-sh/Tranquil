const { Router } = require("express");
const filesControllers = require("../controllers/files");

const filesRouter = Router();

filesRouter.get("/:projectId", filesControllers.getProjectFileList);
filesRouter.get("/:projectId/:fileId", filesControllers.getFileContents);
filesRouter.post("/:projectId/:fileId", filesControllers.updateFile);

module.exports = filesRouter;

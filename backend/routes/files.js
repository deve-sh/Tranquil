const { Router } = require("express");
const {
	getFileContents,
	getProjectFileList,
	updateFile,
} = require("../controllers/files");

const filesRouter = Router();

filesRouter.get("/:projectId", getProjectFileList);
filesRouter.get("/:projectId/:fileId", getFileContents);
filesRouter.post("/:projectId/:fileId", updateFile);

module.exports = filesRouter;

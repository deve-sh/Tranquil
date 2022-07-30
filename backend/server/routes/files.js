import { Router } from "express";
import {
	getFileContents,
	getProjectFileList,
	updateFile,
} from "../controllers/files";

const filesRouter = Router();

filesRouter.get("/:projectId", getProjectFileList);
filesRouter.get("/:projectId/:fileId", getFileContents);
filesRouter.post("/:projectId/:fileId", updateFile);

export default filesRouter;

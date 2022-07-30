import { Router } from "express";
import { getFileContents, getProjectFileList } from "../controllers/files";

const filesRouter = Router();

filesRouter.get("/:projectId", getProjectFileList);
filesRouter.get("/:projectId/:fileId", getFileContents);

export default filesRouter;

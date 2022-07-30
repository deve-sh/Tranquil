import { Router } from "express";
import {
	getUserProjects,
	createProject,
	getProjectInfo,
	updateProject,
} from "../controllers/projects";

const projectsRouter = Router();

projectsRouter.get("/", getUserProjects);
projectsRouter.get("/:projectId", getProjectInfo);
projectsRouter.post("/", createProject);
projectsRouter.put("/:projectId", updateProject);

export default projectsRouter;

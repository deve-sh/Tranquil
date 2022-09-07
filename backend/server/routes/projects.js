const { Router } = require("express");
const {
	getUserProjects,
	createProject,
	getProjectInfo,
	updateProject,
} = require("../controllers/projects");

const projectsRouter = Router();

projectsRouter.get("/", getUserProjects);
projectsRouter.get("/:projectId", getProjectInfo);
projectsRouter.post("/", createProject);
projectsRouter.put("/:projectId", updateProject);

module.exports = projectsRouter;

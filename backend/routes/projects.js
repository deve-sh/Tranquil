const { Router } = require("express");
const projectControllers = require("../controllers/projects");

const projectsRouter = Router();

projectsRouter.post("/", projectControllers.getProjectsByIDs);
projectsRouter.get("/:projectId", projectControllers.getProjectInfo);
projectsRouter.post("/", projectControllers.createProject);
projectsRouter.put("/:projectId", projectControllers.updateProject);

module.exports = projectsRouter;

const { Router } = require("express");
const envVariableControllers = require("../controllers/envVariables");

const envVarsRouter = Router();

envVarsRouter.get(
	"/:projectId",
	envVariableControllers.getProjectEnvironmentVariables
);
envVarsRouter.post(
	"/:projectId",
	envVariableControllers.addEnvironmentVariable
);
envVarsRouter.post(
	"/:projectId/:variableId",
	envVariableControllers.updateEnvironmentVariable
);
envVarsRouter.delete(
	"/:projectId/:variableId",
	envVariableControllers.deleteEnvironmentVariable
);

module.exports = envVarsRouter;

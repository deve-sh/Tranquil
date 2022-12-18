const EnvironmentVariable = require("../../../common/db/models/EnvironmentVariable");

const generateEnvVarSetterCommandsForProject = async (projectId) => {
	let envSetterCommands = [];

	const environmentVariablesForProject = await EnvironmentVariable.find({
		projectId,
	});

	for (let variable of environmentVariablesForProject)
		envSetterCommands.push(`export ${variable.key}=${variable.value}`);

	return envSetterCommands;
};

module.exports = generateEnvVarSetterCommandsForProject;

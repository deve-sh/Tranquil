const EnvironmentVariable = require("../../common/db/models/EnvironmentVariable");

module.exports.addEnvironmentVariable = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { key, value } = req.body;

		if (!key || !value || typeof key !== "string" || typeof value !== "string")
			return res.status(400).json({
				error: "Invalid or missing key/value for project environment variable.",
			});

		// Check if an env variable with the key already exists.
		const existingEnvVariable = await EnvironmentVariable.findOne({
			projectId,
			key,
		});
		if (existingEnvVariable)
			return res.status(400).json({
				error: "An environment variable with that key already exists.",
			});

		const newEnvVariable = new EnvironmentVariable({ projectId, key, value });
		await newEnvVariable.save();

		return res.status(201).json({
			message: "Environment Variable created",
			variable: newEnvVariable._id,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: err.message });
	}
};

module.exports.getProjectEnvironmentVariables = async (req, res) => {
	try {
		const { projectId } = req.params;

		const envVariables = await EnvironmentVariable.find({
			projectId,
		});

		return res.status(200).json({ variables: envVariables });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: err.message });
	}
};

module.exports.updateEnvironmentVariable = async (req, res) => {
	try {
		const { projectId, variableId, newValue } = req.params;

		if (!newValue || typeof newValue !== "string")
			return res.status(400).json({
				error: "Invalid or missing value for project environment variable.",
			});

		const envVariable = await EnvironmentVariable.findById(variableId);
		if (!envVariable || envVariable.projectId !== projectId)
			return res.status(404).json({
				error: "An environment variable with that key does not exist.",
			});

		envVariable.value = newValue;
		await envVariable.save();

		return res.sendStatus(200);
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: err.message });
	}
};

module.exports.deleteEnvironmentVariable = async (req, res) => {
	try {
		const { projectId, variableId } = req.params;

		const envVariable = await EnvironmentVariable.findById(variableId);
		if (!envVariable || envVariable.projectId !== projectId)
			return res.status(404).json({
				error: "An environment variable with that key does not exist.",
			});

		await envVariable.delete();

		return res.sendStatus(204);
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Internal Server Error", error: err.message });
	}
};

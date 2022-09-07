const Project = require("../../common/db/models/Project");
const ProjectFile = require("../../common/db/models/ProjectFile");

module.exports.getUserProjects = (req, res) => {
	return res.send([]);
};

module.exports.getProjectInfo = async (req, res) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);
		if (!project) return res.sendStatus(404);
		return res.send(project);
	} catch (err) {
		return res
			.status(500)
			.send({ error: "Internal Server Error", message: err.message });
	}
};

module.exports.createProject = async (req, res) => {
	const { name: projectName, template } = req.body;
	if (!projectName || !template)
		return res.status(400).json({ error: "Invalid Payload for project." });

	try {
		const boilerplate = require(`../../../common/${template.toLowerCase()}`);
		console.log({ boilerplate });
		if (boilerplate && boilerplate.files) {
			const project = new Project({ projectName, template });
			const projectFiles = boilerplate.files;
			const fileCreationPromises = [];
			for (const file of projectFiles) {
				const fileToSave = new ProjectFile({ projectId: project._id, ...file });
				fileCreationPromises.push(fileToSave.save());
			}

			await Promise.all([...fileCreationPromises, project.save()]);

			return res
				.status(201)
				.send({ message: "Created Project and files successfully", project });
		}
		return res.status(404).send({ error: "Invalid Project Template" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Internal Server Error", message: err.message });
	}
};

module.exports.updateProject = (req, res) => {
	return res.sendStatus(200);
};

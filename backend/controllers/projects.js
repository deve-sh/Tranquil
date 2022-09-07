const db = require("../../common/db");
const Project = require("../../common/db/models/Project");
const ProjectFile = require("../../common/db/models/ProjectFile");

module.exports.getUserProjects = (req, res) => {
	return res.send([]);
};

module.exports.getProjectInfo = async (req, res) => {
	const { projectId } = req.params;
	const project = await Project.findByPk(projectId);
	if (!project) return res.sendStatus(404);
	return res.send(project);
};

module.exports.createProject = async (req, res) => {
	const { name, template } = req.body;
	if (!name || !template)
		return res.status(400).json({ error: "Invalid Payload for project." });

	const transaction = db.transaction();

	try {
		const boilerplate = require(`../../../common/${template.toLowerCase()}`);
		console.log({ boilerplate });
		if (boilerplate) {
			const project = await Project.create(
				{ projectName: name, template },
				{ transaction }
			);
			const projectFiles = boilerplate.files;
			const fileCreationPromises = [];
			for (const file of projectFiles) {
				fileCreationPromises.push(
					ProjectFile.create({ projectId: project.id, ...file })
				);
			}

			await Promise.all(fileCreationPromises);
			await transaction.commit();

			return res
				.status(201)
				.send({ message: "Created Project and files successfully", project });
		}
		return res.status(404).send({ error: "Invalid Project Template" });
	} catch (err) {
		await transaction.rollback();
		return res
			.status(500)
			.json({ error: "Internal Server Error", message: err.message });
	}
};

module.exports.updateProject = (req, res) => {
	return res.sendStatus(200);
};

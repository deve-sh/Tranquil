export const getUserProjects = (req, res) => {
	return res.send([]);
};

export const getProjectInfo = async (req, res) => {
	const { projectId } = req.params;
	return res.send({
		id: "f4cad612-0fef-11ed-861d-0242ac120002",
		name: "Dummy Project",
	});
};

export const createProject = (req, res) => {
	return res.status(201).send({ id: "f4cad612-0fef-11ed-861d-0242ac120002" });
};

export const updateProject = (req, res) => {
	return res.sendStatus(200);
};

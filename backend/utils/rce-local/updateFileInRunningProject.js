const updateFileInRunningProject = async (
	projectId,
	{ operation, newContent, path }
) => {
	if (!projectId || !path) return;

	if (operation === "delete")
		fse.unlink(
			path.resolve(process.cwd(), `../running-projects/${projectId}/${path}`)
		);
	fse.writeFile(
		path.resolve(process.cwd(), `../running-projects/${projectId}/${path}`),
		newContent
	);
};

module.exports = updateFileInRunningProject;

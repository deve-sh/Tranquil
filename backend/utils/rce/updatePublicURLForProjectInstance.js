const updatePublicURLForProjectInstance = async (projectId, url) => {
	if (!url || projectId) return;

	const RunningProject = require("../../../common/db/models/RunningProject");
	await RunningProject.updateOne({ projectId }, { publicURL: url });
};

module.exports = updatePublicURLForProjectInstance;

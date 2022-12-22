const setProjectInstanceAsReadyInDB = async (projectId) => {
	const RunningProject = require("../../../common/db/models/RunningProject");
	await RunningProject.updateOne({ projectId }, { status: "live" });
};

module.exports = setProjectInstanceAsReadyInDB;

const generateRandomPortNumber = async (projectId) => {
	const PortUsed = require("../../common/db/models/PortUsed");
	const projectAlreadyRunning = await PortUsed.findOne({ projectId });
	if (projectAlreadyRunning) return null;

	const range = { min: 1000, max: 99999 };
	const reservedPorts = [80, 3000, 443, 5432, 27017];
	const delta = range.max - range.min;
	const randomPort = Math.round(range.min + Math.random() * delta);

	if (reservedPorts.includes(randomPort))
		return await generateRandomPortNumber();

	const portAlreadyInUse = await PortUsed.findOne({ portNumber: randomPort });
	if (portAlreadyInUse) return await generateRandomPortNumber(projectId);

	return randomPort;
};

module.exports = generateRandomPortNumber;

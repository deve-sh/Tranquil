const shutDownProjectEC2Instance = async (instanceId) => {
	try {
		if (!instanceId)
			return { error: new Error("Pass instanceId to stop EC2 Instance") };

		const ec2 = require("../../aws/ec2");
		await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();

		return {};
	} catch (error) {
		return { error };
	}
};

module.exports = shutDownProjectEC2Instance;

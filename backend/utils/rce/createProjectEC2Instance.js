const createProjectEC2Instance = async () => {
	try {
		const ec2 = require("../../aws/ec2");
		const wait = require("../wait");

		const instanceCreationParams = {
			ImageId: process.env.AWS_EC2_RUNNER_IMAGE_ID,
			InstanceType: process.env.AWS_EC2_RUNNER_INSTANCE_TYPE,
			KeyName: process.env.AWS_EC2_RUNNER_SSH_KEY_PAIR_NAME,
			SecurityGroupIds: [process.env.AWS_EC2_RUNNER_SECURITY_GROUP_ID],
			MinCount: 1,
			MaxCount: 1,
		};

		const { Instances } = await ec2
			.runInstances(instanceCreationParams)
			.promise();
		let instance = Instances[0];
		const instanceId = instance.InstanceId;

		let nTries = 0;
		while (!["running"].includes(instance.State.Name) && nTries < 15) {
			// Keep fetching the status of the instance.
			const filters = {
				Filters: [{ Name: "instance-id", Values: [instanceId] }],
			};
			const instances = await ec2.describeInstances(filters).promise();
			instance = instances.Reservations[0].Instances[0];

			nTries += 1;
			await wait(1500); // Wait for 1.5 seconds before trying again.
		}

		return { data: instance };
	} catch (error) {
		return { error };
	}
};

module.exports = createProjectEC2Instance;

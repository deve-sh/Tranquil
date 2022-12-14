const createProjectEC2Instance = async (projectId) => {
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
			TagSpecifications: [
				{
					ResourceType: "instance",
					Tags: [
						{
							Key: "Name",
							Value: `Project-${projectId}`,
						},
					],
				},
			],
		};

		const { Instances } = await ec2
			.runInstances(instanceCreationParams)
			.promise();
		let instance = Instances[0];
		const instanceId = instance.InstanceId;

		let nTries = 0;
		while (instance.State.Name !== "running" && nTries < 15) {
			// Keep fetching the status of the instance.
			const params = {
				Filters: [{ Name: "instance-id", Values: [instanceId] }],
			};
			const instances = await ec2.describeInstances(params).promise();
			instance = instances.Reservations[0].Instances[0];

			nTries += 1;
			console.log(
				"Try at getting Running EC2 Instance for project",
				projectId,
				":",
				nTries
			);
			await wait(5000); // Wait for 5 seconds before trying again.
		}

		let instanceStatusChecksPassed = 0;
		nTries = 0;
		console.log("Checking instance status for project:", projectId);
		while (instanceStatusChecksPassed < 2) {
			const params = { InstanceIds: [instanceId] };
			const { InstanceStatuses: instanceStatuses } = await ec2
				.describeInstanceStatus(params)
				.promise();

			if (instanceStatuses[0].InstanceStatus.Status === "ok")
				instanceStatusChecksPassed += 1;
			if (instanceStatuses[0].SystemStatus.Status === "ok")
				instanceStatusChecksPassed += 1;

			nTries += 1;
			console.log(
				"Try at getting healthy EC2 Instance for project",
				projectId,
				":",
				nTries
			);
			await wait(10000); // Wait for 10 seconds before trying again.
		}

		return { data: instance };
	} catch (error) {
		return { error };
	}
};

module.exports = createProjectEC2Instance;

const aws = require("./index");

const ec2 = new aws.EC2({ apiVersion: "2016-11-15" });

module.exports = ec2;

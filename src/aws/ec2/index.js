const { promisify } = require("util");
const EC2 = require("aws-sdk/clients/ec2");
const { getRegion } = require("../../util/getRegion");

const apiVersion = "latest";
const region = getRegion();

const ec2 = new EC2({ apiVersion, region });

// promisify ec2 functions
const asyncCreateSecurityGroup = promisify(ec2.createSecurityGroup.bind(ec2));
const asyncAuthorizeSecurityGroupIngress = promisify(
  ec2.authorizeSecurityGroupIngress.bind(ec2)
);
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncDescribeInstances = promisify(ec2.describeInstances.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncAssociateIamInstanceProfile = promisify(
  ec2.associateIamInstanceProfile.bind(ec2)
);
const asyncWaitFor = promisify(ec2.waitFor.bind(ec2));

module.exports = {
  asyncCreateSecurityGroup,
  asyncAuthorizeSecurityGroupIngress,
  asyncCreateKeyPair,
  asyncDescribeInstances,
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncWaitFor,
};

const { createKeyPair } = require('./createKeyPair');
const { createSecurityGroup } = require('./createSecurityGroup');
const { createEc2Instance } = require('./createEc2Instance');

const createAndConfigEc2 = async (projectName) => {
  await createKeyPair();
  await createSecurityGroup();
  const ec2InstanceData = await createEc2Instance(projectName);
  return ec2InstanceData;
};

module.exports = { createAndConfigEc2 };

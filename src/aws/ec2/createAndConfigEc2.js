const { createKeyPair } = require('./createKeyPair');
const { createSecurityGroup } = require('./createSecurityGroup');
const { createEc2Instance } = require('./createEc2Instance');

const createAndConfigEc2 = async (projectData) => {
  await createKeyPair();
  await createSecurityGroup(projectData);
  await createEc2Instance(projectData);
};

module.exports = { createAndConfigEc2 };

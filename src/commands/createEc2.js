const {
  createKeyPair,
  createSecurityGroup,
  createEc2Instance,
} = require("../aws/ec2");

const createEc2 = async () => {
  await createKeyPair();
  await createSecurityGroup();
  await createEc2Instance();
};

module.exports = { createEc2 };

createEc2();

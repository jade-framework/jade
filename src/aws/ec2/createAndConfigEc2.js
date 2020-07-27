const { createKeyPair } = require("./createKeyPair");
const { createSecurityGroup } = require("./createSecurityGroup");
const { createEc2Instance } = require("./createEc2Instance");
const { setInstanceIp } = require("./setInstanceIp");

const createAndConfigEc2 = async () => {
  await createKeyPair();
  await createSecurityGroup();
  await createEc2Instance();
  await setInstanceIp();
};

module.exports = { createAndConfigEc2 };

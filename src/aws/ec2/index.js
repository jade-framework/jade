const { getAmi } = require("./getAmi");
const { createKeyPair } = require("./createKeyPair");
const { createSecurityGroup } = require("./createSecurityGroup");
const { createEc2Instance } = require("./createEc2Instance");

module.exports = {
  getAmi,
  createKeyPair,
  createSecurityGroup,
  createEc2Instance,
};

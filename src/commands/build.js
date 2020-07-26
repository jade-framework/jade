const { configEC2IamRole } = require("../aws/iam/configEC2IamRole");
const { createKeyPair } = require("../aws/ec2/createKeyPair");
const { createSecurityGroup } = require("../aws/ec2/createSecurityGroup");
const { createEc2Instance } = require("../aws/ec2/createEc2Instance");
const { installEc2JadeEnvironment } = require("./installEc2JadeEnvironment");
const { setInstanceIp } = require("../aws/ec2/setInstanceIp");
const { printBuildSuccess } = require("./printBuildSuccess");

async function build(bucketName) {
  try {
    // await configEC2IamRole();
    // await createKeyPair();
    // await createSecurityGroup();
    // await createEc2Instance();
    // await setInstanceIp();
    await installEc2JadeEnvironment(bucketName);
    await printBuildSuccess();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { build };
build();

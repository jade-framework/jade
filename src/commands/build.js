const { configEC2IamRole } = require("../aws/iam/configEc2IamRole");
const { createEC2Instance } = require("../aws/ec2/createEc2Instance");
const { installEC2JadeEnvironment } = require("./installEc2JadeEnvironment");
const { setInstanceIp } = require("../aws/ec2/setInstanceIp");
const { printBuildSuccess } = require("./printBuildSuccess");

async function build(bucketName) {
  try {
    await configEC2IamRole();
    await createEC2Instance();
    await setInstanceIp();
    await installEC2JadeEnvironment(bucketName);
    await printBuildSuccess();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { build };

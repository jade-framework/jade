const { configEc2IamRole } = require("../aws/iam");
const { createAndConfigEc2 } = require("../aws/ec2");
const { installEc2JadeEnvironment } = require("./installEc2JadeEnvironment");
const { printBuildSuccess } = require("./printBuildSuccess");

async function build(bucketName) {
  try {
    await configEc2IamRole();
    await createAndConfigEc2();
    await installEc2JadeEnvironment(bucketName);
    await printBuildSuccess();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { build };

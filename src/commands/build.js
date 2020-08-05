const { configEc2IamRole } = require("../aws/iam");
const { createAndConfigEc2 } = require("../aws/ec2");
const { installEc2JadeEnvironment } = require("./installEc2JadeEnvironment");
const { printBuildSuccess } = require("./printBuildSuccess");
const { jadeErr } = require("../util/logger");

async function build() {
  try {
    // await configEc2IamRole();
    // await createAndConfigEc2();
    await installEc2JadeEnvironment();
    await printBuildSuccess();
  } catch (err) {
    jadeErr(err);
  }
}

module.exports = { build };
build();

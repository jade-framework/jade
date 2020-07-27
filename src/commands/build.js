const { createAndConfigEc2 } = require("../aws/ec2");
const { configEc2IamRole } = require("../aws/iam");
const { installEc2JadeEnvironment } = require("./installEc2JadeEnvironment");
const { printBuildSuccess } = require("./printBuildSuccess");

async function build(bucketName) {
  try {
    // await configEc2IamRole();
    // await createAndConfigEc2();
    await installEc2JadeEnvironment(
      "test-c84392b6-d0e6-4fe0-8aa0-763bc143a28f"
    );
    await printBuildSuccess();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { build };
build();

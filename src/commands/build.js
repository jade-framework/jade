const { configEc2IamRole } = require('../aws/iam');
const { createAndConfigEc2 } = require('../aws/ec2');
const {
  installEc2JadeEnvironment,
} = require('../aws/ec2/installEc2JadeEnvironment');
const { printBuildSuccess } = require('./printBuildSuccess');
const { jadeErr } = require('../util/logger');

async function build(bucketName) {
  try {
    await configEc2IamRole();
    await createAndConfigEc2();
    await installEc2JadeEnvironment(bucketName);
    await printBuildSuccess();
  } catch (err) {
    jadeErr(err);
  }
}

module.exports = { build };

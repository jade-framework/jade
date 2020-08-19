const { jadeErr, jadeLog } = require('../util/logger');
const { launchApp } = require('../util/setup');
const {
  validateUserPermissions,
  validateAwsIsNotSetup,
} = require('../util/validations');

const init = async (directory, args) => {
  try {
    jadeLog('Checking if your AWS account is correctly setup...');
    const invalidUserPermissions = await validateUserPermissions();
    if (invalidUserPermissions) {
      jadeErr(invalidUserPermissions);
      return;
    }
    jadeLog('AWS account is correctly setup.');

    const invalidAws = await validateAwsIsNotSetup(directory);
    if (invalidAws) {
      jadeErr(invalidAws);
      return;
    }
    await launchApp('init', directory, args);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

const { launchApp } = require('../util/setup');
const { validateAwsIsSetup } = require('../util/validations');
const { jadeErr, jadeLog } = require('../util/logger');

const add = async (directory, args) => {
  try {
    const invalidAws = await validateAwsIsSetup(directory);
    if (invalidAws) {
      jadeErr(invalidAws);
      return;
    }

    await launchApp('add', directory, args);
  } catch (err) {
    jadeLog(err);
  }
};

module.exports = { add };

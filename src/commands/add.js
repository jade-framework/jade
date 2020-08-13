const { launchApp } = require('../util/setup');
const { validateAwsIsSetup } = require('../util/validations');

const add = async (directory) => {
  try {
    const invalidAws = await validateAwsIsSetup(directory);
    if (invalidAws) {
      jadeErr(invalidAws);
      return;
    }

    await launchApp('add', directory);
  } catch (err) {
    jadeLog(err);
  }
};

module.exports = { add };

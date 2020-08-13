const { jadeErr } = require('../util/logger');
const { validateUser, launchApp } = require('../util/setup');

const init = async (directory) => {
  try {
    const isUserValid = await validateUser();
    if (!isUserValid) return;
    // const dynamoExists = await validateDynamoExists();
    // if (dynamoExists)
    await launchApp('init', directory);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

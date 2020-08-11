const { exists, getJadePath } = require('../util/fileUtils');
const { launchApp } = require('../util/setup');
const { join } = require('path');

const add = async (directory) => {
  try {
    // will be changed to check if Jade services are already setup
    const jadePath = getJadePath(directory);
    if (
      !(await exists(jadePath)) ||
      !(await exists(join(jadePath, 'config.json')))
    ) {
      console.log(`You need to use "jade init" to setup your AWS framework.`);
      return;
    }

    await launchApp('add', directory);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { add };

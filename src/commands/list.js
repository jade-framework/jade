const { readConfig } = require('../util/fileUtils');
const { jadeLog } = require('../util/logger');

const list = async (directory) => {
  const config = await readConfig(directory);
  if (config.length > 0) {
    jadeLog('Here are your current files:');
    config.map((data) => jadeLog(data.projectName));
  } else {
    jadeLog('You have no active projects currently.');
  }
};

module.exports = { list };

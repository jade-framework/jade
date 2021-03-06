const { jadeLog, jadeErr } = require('../../util/logger');
const { sendFilesAndBuildCommands } = require('../../util/connect');

const installEc2JadeEnvironment = async (projectData) => {
  try {
    jadeLog('Beginning connection to EC2 server...');
    await sendFilesAndBuildCommands(projectData);
    jadeLog('EC2 server setup successfully.');
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = { installEc2JadeEnvironment };

const { readConfig } = require('../../util/fileUtils');
const { cwd } = require('../../templates/constants');
const { jadeLog, jadeErr } = require('../../util/logger');
const { sendSetupAndBuildCommands } = require('../../util/connect');

const installEc2JadeEnvironment = async (bucketName) => {
  try {
    const config = await readConfig(cwd);
    const project = config.find((obj) => obj.bucketName === bucketName);

    jadeLog('Beginning connection to EC2 server...');
    await sendSetupAndBuildCommands(project);
    jadeLog('EC2 server setup successfully.');
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = { installEc2JadeEnvironment };

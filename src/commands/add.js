const { exists, getJadePath } = require('../util/fileUtils');
const {
  getUserProjectData,
  validateUser,
  setupApp,
  setupConfig,
} = require('../util/setup');
const { sendBuildCommands } = require('../util/connect');
const { jadeLog } = require('../util/logger');
const { join } = require('path');

const add = async (directory) => {
  try {
    const isValid = await validateUser();
    if (!isValid) return;

    // will be changed to check if Jade services are already setup
    const jadePath = getJadePath(directory);
    if (
      !(await exists(jadePath)) ||
      !(await exists(join(jadePath, 'config.json')))
    ) {
      console.log(`You need to use "jade init" to setup your AWS framework.`);
      return;
    }

    const projectData = await getUserProjectData('add');
    if (!projectData) return;

    jadeLog('Thank you! Your new Jade app will now be setup.');
    const isConfigSetup = await setupConfig(directory, projectData);
    if (!isConfigSetup) return;

    const isAppSetup = await setupApp(directory, projectData);
    if (!isAppSetup) return;

    await sendBuildCommands(projectData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { add };

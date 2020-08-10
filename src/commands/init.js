const { jadeLog, jadeErr } = require('../util/logger');
const {
  getUserProjectData,
  validateUser,
  setupApp,
  setupConfig,
  setupAwsInfra,
} = require('../util/setup');

const init = async (directory) => {
  try {
    const isUserValid = await validateUser();
    if (!isUserValid) return;

    const projectData = await getUserProjectData('init');
    if (!projectData) return;

    jadeLog('Thank you! The Jade framework will now be setup.');
    const isConfigSetup = await setupConfig(directory, projectData);
    if (!isConfigSetup) return;

    const { bucketName } = projectData;
    const isAppSetup = await setupApp(directory, projectData);
    if (!isAppSetup) return;

    await setupAwsInfra(bucketName);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

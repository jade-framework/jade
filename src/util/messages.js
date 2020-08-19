const { jadeLog } = require('./logger');

const printBuildSuccess = async ({ publicIp, cloudFrontDomainName }) => {
  jadeLog('Your deployment is ready!');
  jadeLog(
    'To synchronize your Github commits with new builds, follow these instructions:',
  );
  jadeLog('1. Go to your GitHub repository');
  jadeLog(`2. Click on "Settings" and navigate to "Webhooks"`);
  jadeLog(`3. Click on "Add webhook"`);
  jadeLog(`4. Key in your password if required`);
  jadeLog(`5. Under "Payload URL", key in: http://${publicIp}/webhook`);
  jadeLog(`6. Change "Content type" to "application/json"`);
  jadeLog(`7. Leave secret empty`);
  jadeLog(`8. Send just the push event`);
  jadeLog(`9. Add webhook`);
  jadeLog(
    `10. Make a change to your repo and watch it get deployed on ${cloudFrontDomainName}`,
  );
};

const appNotFound = () => {
  jadeLog(
    'This app does not exist or has already been deleted. Please use "jade list" to see your current Jade apps.',
  );
};

const appsNotFound = () => {
  jadeLog(
    'You do not have any Jade apps to delete. Please run "jade init" to create a new one.',
  );
};

const userMsg = (command) => {
  if (command === 'add') {
    return 'Thank you! Your new Jade app will now be setup.';
  } else if (command === 'init') {
    return 'Thank you! The Jade framework will now be setup.';
  }
};

module.exports = { printBuildSuccess, appNotFound, appsNotFound, userMsg };

const { getJadePath, readJSONFile } = require('./fileUtils');
const { cwd } = require('../templates/constants');

async function printBuildSuccess() {
  const jadePath = getJadePath(cwd);

  const ec2Data = await readJSONFile('ec2Instance', jadePath);
  const publicIp = ec2Data.Instances[0].PublicIpAddress;

  console.log('Your deployment is ready.');
  console.log(
    'To synchronize your Github commits with new builds, follow these instructions:',
  );
  console.log('1. Go to your Github repository');
  console.log(`2. Click on "Settings" and navigate to "Webhooks"`);
  console.log(`3. Click on "Add webhook"`);
  console.log(`4. Key in your password if required`);
  console.log(`5. Under "Payload URL", key in: http://${publicIp}/webhook`);
  console.log(`6. Change "Content type" to "application/json"`);
  console.log(`7. Leave secret empty`);
  console.log(`8. Send just the push event`);
  console.log(`9. Add webhook`);
  console.log(`10. Make a change to your repo and watch it get deployed!`);
}

module.exports = { printBuildSuccess };

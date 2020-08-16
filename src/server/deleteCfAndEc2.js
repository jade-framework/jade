const { promisify } = require('util');
const { join } = require('path');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const readFile = promisify(fs.readFile);
const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));
const oneMinute = 60000;

const AWS = require('aws-sdk');
const { getRegion } = require('./getRegion');
const region = getRegion();
const apiVersion = 'latest';

AWS.config.update({ region });

const cf = new AWS.CloudFront({ apiVersion });
const asyncGetDistribution = promisify(cf.getDistribution.bind(cf));
const asyncDeleteDistribution = promisify(cf.deleteDistribution.bind(cf));

// const args = process.argv;
// let eTag = args[2];

let eTag;

const deleteCfWithRetries = async (cfId, maxRetries = 100, attempts = 0) => {
  try {
    const getRes = await asyncGetDistribution({ Id: cfId });
    console.log(getRes);
    if (getRes.Distribution.Status !== 'Deployed') {
      await sleep(oneMinute);
      return await deleteCfWithRetries(cfId, maxRetries, attempts + 1);
    } else {
      eTag = getRes.ETag;
      await asyncDeleteDistribution({ Id: cfId, IfMatch: eTag });
      return true;
    }
  } catch (err) {
    return await deleteCfWithRetries(cfId, maxRetries, attempts + 1);
  }
};

const deleteCf = async () => {
  try {
    const initialProjectData = await readFile(
      join(userDir, 'server', 'initialProjectData.json'),
    );
    const initialData = JSON.parse(initialProjectData);
    const { cloudFrontDistributionId } = initialData;
    await deleteCfWithRetries(cloudFrontDistributionId);
  } catch (err) {
    console.log(err);
  }
};

const deleteEc2 = async () => {
  const curlRes = await exec(
    'curl http://169.254.169.254/latest/meta-data/instance-id',
  );
  const id = curlRes.stdout;
  await exec(`aws ec2 terminate-instances --instance-ids ${id}`);
};

(async () => {
  try {
    await deleteCf();
    await deleteEc2();
  } catch (err) {
    console.log(err);
  }
})();

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

const readFile = promisify(fs.readFile);
const { join } = require('path');

const bucketSuffixes = ['prod', 'builds', 'lambda', 'stage'];
const userDir = join('/', 'home', 'ec2-user');
const prodBucket = bucketSuffixes[0];
const buildsBucket = bucketSuffixes[1];
const stageBucket = bucketSuffixes[3];

module.exports = async function triggerBuild(webhook) {
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;
  const repoDir = join(userDir, repoName);
  const branch = webhook.ref.replace('refs/heads/', '');

  try {
    const bucketJSON = await readFile(
      join(userDir, 'server', 's3BucketName.json'),
    );

    // need to change to find the right bucketName for multiple apps
    const { bucketName } = JSON.parse(bucketJSON)[0];
    let pull;

    if (branch === 'master') {
      pull = await exec(`git -C ${repoDir} pull ${cloneUrl}`);
    } else if (branch === 'staging') {
      await exec(`git checkout -b staging`);
      pull = await exec(`git -C ${repoDir} pull ${cloneUrl}`);
    }

    if (/Already up to date/.test(pull.stdout)) {
      return {
        statusCode: 202,
        msg: 'Repo has not changed, build not triggered.',
      };
    }

    (async () => {
      try {
        if (branch === 'master') {
          await exec(`yarn --cwd ${repoDir} build`);
          await exec(`aws s3 sync public s3://${bucketName}-${prodBucket}`);
          await exec(
            `aws s3 sync public s3://${bucketName}-${buildsBucket}/${Date.now()}`,
          );
        } else if (branch === 'staging') {
          await exec(`yarn --cwd ${repoDir} build`);
          await exec(`aws s3 sync public s3://${bucketName}-${stageBucket}`);
        }
      } catch (err) {
        console.log(err); // convert to logger later
      }
    })();

    return {
      statusCode: 200,
      msg: 'Webhook successfully processed, Jade build triggered.',
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 202,
      msg: 'Error in processing your webhook, please contact Jade team.',
    };
  }
};

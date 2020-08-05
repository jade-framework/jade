const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

const readFile = promisify(fs.readFile);
const { join } = require('path');

const userDir = join('/', 'home', 'ec2-user');

module.exports = async function triggerBuild(webhook) {
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;
  const repoDir = join(userDir, repoName);

  try {
    const bucketJSON = await readFile(
      join(userDir, 'server', 's3BucketName.json'),
    );

    const { bucketName } = JSON.parse(bucketJSON);
    const pull = await exec(`git -C ${repoDir} pull ${cloneUrl}`);

    if (/Already up to date/.test(pull.stdout)) {
      return {
        statusCode: 202,
        msg: 'Repo has not changed, build not triggered.',
      };
    }

    (async () => {
      await exec(`yarn --cwd ${repoDir} build`);
      await exec(`aws s3 sync public s3://${bucketName}`);
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

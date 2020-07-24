const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs");
const readFile = promisify(fs.readFile);

module.exports = async function triggerBuild(webhook) {
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;

  try {
    const bucketName = await readFile("./s3BucketName.json");
    await exec(`cd /home/ec2-user/ & git clone ${cloneUrl}`);
    await exec(`cd ${repoName} & yarn build`);
    await exec(`aws s3 sync public s3://${bucketName}`);
  } catch (err) {
    console.log(err);
  }
};

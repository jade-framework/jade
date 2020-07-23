const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = async function triggerBuild(webhook) {
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;

  try {
    await exec(`cd /home/ec2-user/ & git clone ${cloneUrl}`);
    await exec(`cd ${repoName} & yarn build`);
  } catch (err) {
    console.log(err);
  }
};

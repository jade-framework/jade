const configEC2IamRole = require("../aws/iam/configEC2IamRole");
const createEC2Instance = require("../aws/ec2/createEC2Instance");
const installEC2JadeEnvironment = require("./installEC2JadeEnvironment");
const setInstanceIP = require("../aws/ec2/setInstanceIP");

async function build(bucketName) {
  try {
    await configEC2IamRole();
    await createEC2Instance();
    await setInstanceIP();
    await installEC2JadeEnvironment(bucketName);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { build };

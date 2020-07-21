const configEC2IamRole = require("../aws/iam/configEC2IamRole");
const createEC2Instance = require("../aws/ec2/createEC2Instance");
const installEC2JadeEnvironment = require("./installEC2JadeEnvironment");
const setInstanceIP = require("../aws/ec2/setInstanceIP");

const seconds = 1000;

async function setBuildConfig() {
  try {
    await configEC2IamRole();
    setTimeout(createEC2Instance, 10 * seconds);
    setTimeout(setInstanceIP, 30 * seconds);
    setTimeout(installEC2JadeEnvironment, 40 * seconds);
  } catch (err) {
    console.log(err);
  }
}

setBuildConfig();

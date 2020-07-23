const clearJadeFolder = require("./clearJadeFolder");
const terminateJadeEC2Instances = require("./terminateJadeEC2Instances");
const removePermissions = require("./removePermissions");

async function resetJade() {
  await clearJadeFolder();
  await terminateJadeEC2Instances();
  await removePermissions();
}

resetJade();

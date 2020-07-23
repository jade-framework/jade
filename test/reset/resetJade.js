const clearJadeFolder = require("./clearJadeFolder");
const terminateJadeEC2Instances = require("./terminateJadeEC2Instances");
const removePermissions = require("./removePermissions");

clearJadeFolder();
terminateJadeEC2Instances();
removePermissions();

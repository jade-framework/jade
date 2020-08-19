const { deleteJadeFolder } = require('./deleteJadeFolder');
const { terminateJadeEc2Instances } = require('./terminateJadeEc2Instances');
const { removePermissions } = require('./removePermissions');
const { cleanup } = require('./cleanup');

// Only S3 is deleted, CF is disabled
// Cronjob started to delete CF
// Delete Lambda, DDB
// Delete Jade folder
// Don't delete permissions for EC2
// Don't delete Jade user group
const resetJade = async () => {
  await cleanup();
  await deleteJadeFolder();
};

// CF, EC2 and S3 for each app are all deleted
// delete Lambda, DDB, Jade folder
// Delete EC2 permissions and then Jade user group
const hardResetJade = async () => {
  await resetJade();
  await removePermissions();
  // await terminateJadeEc2Instances();
};

module.exports = { resetJade, hardResetJade };

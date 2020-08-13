const { deleteJadeFolder } = require('./deleteJadeFolder');
const { terminateJadeEc2Instances } = require('./terminateJadeEc2Instances');
const { removePermissions } = require('./removePermissions');
const { cleanup } = require('../../commands/cleanup');

async function resetJade() {
  await deleteJadeFolder();
  await terminateJadeEc2Instances();
  await removePermissions();
  await cleanup();
}

resetJade();

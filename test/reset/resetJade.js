const { clearJadeFolder } = require('./clearJadeFolder');
const { terminateJadeEc2Instances } = require('./terminateJadeEc2Instances');
const { removePermissions } = require('./removePermissions');
const cleanup = require('../../src/commands/cleanup');

async function resetJade() {
  await clearJadeFolder();
  await terminateJadeEc2Instances();
  await removePermissions();
  cleanup();
}

resetJade();

const { createDirectory, writeConfig } = require('../src/util/fileUtils');
const { getCallerIdentity } = require('../src/aws');
const { cwd } = require('../src/templates/constants');

async function setup() {
  const userData = await getCallerIdentity();
  await createDirectory('.jade', cwd);
  await writeConfig(testDir, { userData });
}

setup();

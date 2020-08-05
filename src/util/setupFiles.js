const { createDirectory, writeConfig } = require("./fileUtils");
const { getCallerIdentity } = require("../aws");
const { cwd } = require("../templates/constants");

async function setup() {
  const userData = await getCallerIdentity();
  await createDirectory(".jade", cwd);
  await writeConfig(testDir, { userData });
}

setup();

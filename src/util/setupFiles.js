const { createDirectory, writeConfig } = require("./fileUtils");
const { getCallerIdentity } = require("../aws");
const { hostDirectory } = require("../constants/allConstants");

async function setup() {
  const userData = await getCallerIdentity();
  await createDirectory(".jade", hostDirectory);
  await writeConfig(testDir, { userData });
}

setup();

const { createDirectory, writeConfig } = require("./fileUtils");
const { getCallerIdentity } = require("../aws");

// this will create all files in a .jade folder within the package => must be changed
const testDir = process.cwd();

async function setup() {
  const userData = await getCallerIdentity();
  await createDirectory(".jade", testDir);
  await writeConfig(testDir, { userData });
}

setup();

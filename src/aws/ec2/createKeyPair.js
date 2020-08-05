const { asyncCreateKeyPair } = require("../awsAsyncFunctions");
const {
  exists,
  join,
  createJSONFile,
  getJadePath,
  writeFile,
  chmod,
} = require("../../util/fileUtils");
const {
  cwd,
  privateKeyFilename,
  keyPair,
  jadeKeyPair,
} = require("../../templates/constants");

// default data
const keyPairParams = {
  KeyName: jadeKeyPair,
};

const createKeyPair = async () => {
  const jadePath = getJadePath(cwd);
  const privateKeyPath = join(jadePath, privateKeyFilename);
  try {
    if (!(await exists(join(jadePath, `${keyPair}.json`)))) {
      console.log("Creating Jade key pair and .pem file...");
      const keyPairResponse = await asyncCreateKeyPair(keyPairParams);
      const { KeyMaterial, ...otherData } = keyPairResponse;
      await writeFile(privateKeyPath, KeyMaterial);
      await chmod(privateKeyPath, 0o400);
      await createJSONFile(keyPair, jadePath, otherData);
      return;
    } else {
      console.log("Jade key pair already exists.");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createKeyPair };

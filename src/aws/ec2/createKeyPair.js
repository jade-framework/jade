const { asyncCreateKeyPair } = require("./index");
const {
  join,
  createJSONFile,
  getJadePath,
  writeFile,
  chmod,
} = require("../../util/fileUtils");
const {
  hostDirectory,
  privateKeyFilename,
} = require("../../constants/allConstants");

// default data
const keyPairParams = {
  KeyName: "jade-key-pair",
};

module.exports = async function createKeyPair() {
  const jadePath = getJadePath(hostDirectory);
  const privateKeyPath = join(jadePath, privateKeyFilename);
  try {
    const keyPairResponse = await asyncCreateKeyPair(keyPairParams);
    const { KeyMaterial, ...otherData } = keyPairResponse;
    await writeFile(privateKeyPath, KeyMaterial);
    await chmod(privateKeyPath, 0o400);
    await createJSONFile("keyPair", jadePath, otherData);
  } catch (err) {
    console.log(err);
  }
};

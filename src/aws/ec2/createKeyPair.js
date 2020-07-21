const path = require("path");
const { asyncCreateKeyPair } = require("./index");
const {
  createJSONFile,
  getJadePath,
  writeFile,
  chmod,
} = require("../../util/fileUtils");
const { hostDirectory } = require("../../constants/allConstants");
const fs = require("fs");

// default data
const keyPairParams = {
  KeyName: "jade-key-pair",
};

module.exports = async function createKeyPair() {
  const jadePath = getJadePath(hostDirectory);
  const privateKeyFilename = path.join(jadePath, "jade-key-pair.pem");
  try {
    const keyPairResponse = await asyncCreateKeyPair(keyPairParams);
    const { KeyMaterial, ...otherData } = keyPairResponse;
    await writeFile(privateKeyFilename, KeyMaterial);
    await chmod(privateKeyFilename, 0o400);
    await createJSONFile("keyPair", jadePath, otherData);
  } catch (err) {
    console.log(err);
  }
};

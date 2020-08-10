const {
  asyncCreateKeyPair,
  asyncDescribeKeyPairs,
  asyncDeleteKeyPair,
} = require('../awsAsyncFunctions');
const {
  exists,
  join,
  createJSONFile,
  getJadePath,
  writeFile,
  chmod,
  unlink,
} = require('../../util/fileUtils');
const {
  cwd,
  privateKeyFilename,
  keyPair,
  jadeKeyPair,
} = require('../../templates/constants');
const {
  confirmOverwriteKeyPair,
  confirmDeleteKeyPair,
} = require('../../util/questions');
const { jadeErr } = require('../../util/logger');

// default data
const keyPairParams = {
  KeyName: jadeKeyPair,
};
const jadePath = getJadePath(cwd);
const privateKeyPath = join(jadePath, privateKeyFilename);
const keyPairJson = `${keyPair}.json`;

const createJadeKeyPair = async () => {
  console.log('Creating Jade key pair and .pem file...');
  const keyPairResponse = await asyncCreateKeyPair(keyPairParams);
  const { KeyMaterial, ...otherData } = keyPairResponse;
  await writeFile(privateKeyPath, KeyMaterial);
  await chmod(privateKeyPath, 0o400);
  await createJSONFile(keyPair, jadePath, otherData);
  console.log('Jade key pair successfully created.');
};

const deleteJadeKeyPair = async () => {
  try {
    console.log('Removing old key pair data...');
    await asyncDeleteKeyPair(keyPairParams);
    if (await exists(privateKeyPath)) await unlink(privateKeyPath);
    if (await exists(join(jadePath, keyPairJson))) {
      await unlink(join(jadePath, keyPairJson));
    }
    console.log('Old key pair removed.');
  } catch (err) {
    console.log(err);
  }
};

const createKeyPair = async () => {
  try {
    console.log('Checking for existing key pair...');
    let jadeKeyExists = await asyncDescribeKeyPairs({
      Filters: [{ Name: 'key-name', Values: [jadeKeyPair] }],
    });
    let create = true;
    // checking if Jade key pair exists in AWS
    if (jadeKeyExists.KeyPairs.length > 0) {
      // checking if necessary key pair files are available
      if (
        (await exists(join(jadePath, keyPairJson))) &&
        (await exists(privateKeyPath))
      ) {
        create = await confirmOverwriteKeyPair();
      } else {
        deleteKeyPair = await confirmDeleteKeyPair();
        if (!deleteKeyPair) return;
      }
      if (create) {
        await deleteJadeKeyPair();
      }
    }
    if (create) {
      await createJadeKeyPair();
    } else {
      console.log('Using existing Jade key pair.');
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createKeyPair };

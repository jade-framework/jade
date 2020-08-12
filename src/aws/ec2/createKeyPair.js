const {
  asyncCreateKeyPair,
  asyncDescribeKeyPairs,
  asyncDeleteKeyPair,
} = require('../awsAsyncFunctions');
const {
  exists,
  join,
  getJadePath,
  writeFile,
  chmod,
  unlink,
} = require('../../util/fileUtils');
const {
  cwd,
  privateKeyFilename,
  jadeKeyPair,
} = require('../../templates/constants');
const { confirmDeleteKeyPair } = require('../../util/questions');
const { jadeLog, jadeErr } = require('../../util/logger');

// default data
const keyPairParams = {
  KeyName: jadeKeyPair,
};
const jadePath = getJadePath(cwd);
const privateKeyPath = join(jadePath, privateKeyFilename);

const createJadeKeyPair = async () => {
  try {
    jadeLog('Creating Jade key pair and .pem file...');
    const keyPairResponse = await asyncCreateKeyPair(keyPairParams);
    const { KeyMaterial } = keyPairResponse;
    await writeFile(privateKeyPath, KeyMaterial);
    await chmod(privateKeyPath, 0o400);
    jadeLog('Jade key pair successfully created.');
  } catch (err) {
    jadeErr(err);
  }
};

const deleteJadeKeyPair = async () => {
  try {
    jadeLog('Removing old key pair data...');
    await asyncDeleteKeyPair(keyPairParams);
    if (await exists(privateKeyPath)) await unlink(privateKeyPath);
    jadeLog('Old key pair removed.');
  } catch (err) {
    jadeErr(err);
  }
};

const createKeyPair = async () => {
  try {
    jadeLog('Checking for existing key pair...');
    let jadeKeyExists = await asyncDescribeKeyPairs({
      Filters: [{ Name: 'key-name', Values: [jadeKeyPair] }],
    });

    // checking if Jade key pair exists in AWS
    if (jadeKeyExists.KeyPairs.length > 0) {
      // checking if private key is available
      if (!(await exists(privateKeyPath))) {
        deleteKeyPair = await confirmDeleteKeyPair();
        if (!deleteKeyPair) return;
        await deleteJadeKeyPair();
        await createJadeKeyPair();
      } else {
        jadeLog('Using existing Jade key pair.');
      }
    } else {
      await createJadeKeyPair();
    }
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createKeyPair };

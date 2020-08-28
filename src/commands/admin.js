const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { validateAwsIsSetup } = require('../util/validations');
const { jadeErr, jadeLog } = require('../util/logger');

const admin = async (directory) => {
  try {
    const invalidAws = await validateAwsIsSetup(directory);
    if (invalidAws) {
      jadeErr(invalidAws);
      return;
    }
    jadeLog('Installing admin packages...');
    await exec(`yarn --cwd ${path.join(__dirname, '../admin/server')} install`);
    await exec(`yarn --cwd ${path.join(__dirname, '../admin/client')} install`);
    jadeLog('Admin packages installed.');
    jadeLog('Starting admin server...');
    exec(`yarn --cwd ${path.join(__dirname, '../admin/server')} start`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { admin };

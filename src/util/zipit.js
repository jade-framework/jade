const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { jadeErr } = require('../util/logger');

const zipit = async (lambdaName, file) => {
  try {
    await exec(`zip -j ${lambdaName}.zip ${file}`);
  } catch (err) {
    jadeErr(err);
  }

  return `${lambdaName}.zip`;
};

module.exports = { zipit };

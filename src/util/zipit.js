const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const cwd = process.cwd();

const zipit = async (lambdaName, directoryName) => {
  try {
    await exec(`zip -r ${lambdaName}.zip ${cwd}/${directoryName}`);
  } catch (err) {
    console.log(err);
  }

  return `${directoryName}/${lambdaName}.zip`;
};

module.exports = { zipit };

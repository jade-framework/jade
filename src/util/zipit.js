const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const cwd = process.cwd();

const zipit = async (lambdaName, file) => {
  try {
    await exec(`zip -j ${lambdaName}.zip ${file}`);
  } catch (err) {
    console.log(err);
  }

  return `${lambdaName}.zip`;
};

module.exports = { zipit };

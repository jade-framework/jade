const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildAndExport = async () => {
  await exec('yarn --cwd ./gatsby-blog build');
  await exec('cp ./gatsby-blog/public /output');
};
buildAndExport();

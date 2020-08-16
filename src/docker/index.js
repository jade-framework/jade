const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildAndExport = async () => {
  console.log('Container running...');
  await exec('echo "$repo_dir_env"');
  try {
    console.log('Updating dependencies...');
    await exec('yarn --cwd ./gatsby-default install');
    await exec('yarn --cwd ./gatsby-default cache clean');
    console.log('Building project...');
    await exec('yarn --cwd ./gatsby-default build');
    console.log('Copying project to host...');
    await exec('cp -r ./gatsby-default/public /output');
    console.log('Build complete and exported!');
  } catch (error) {
    console.log(error);
  }
};
buildAndExport();

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildAndExport = async () => {
  // await exec('yarn --cwd ./gatsby-blog build');
  // await exec('cp ./gatsby-blog/public /output');
  console.log('Container index.html running');
  await exec('echo "$repo_dir_env"');
  // await exec('cp jeremy/Dockerfile jeremy/capstone');
  // await exec('cp /jeremy/greetings.js /jeremy/greetingscopied.js'); // this works
  await exec('yarn --cwd ./gatsby-blog build');
  try {
    await exec('cp ./gatsby-blog/public /output');
  } catch (error) {
    console.log(error);
  }
};
buildAndExport();

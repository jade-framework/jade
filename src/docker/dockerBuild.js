const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildAndExport = async () => {
  console.log('Container running...');
  const repoDir = process.env.REPO_DIR;
  console.log('repoDir from dockerBuild', repoDir);
  try {
    console.log('Updating dependencies...');
    await exec(`yarn --cwd ${repoDir} install`);
    // await exec(`yarn --cwd ${repoDir} cache clean`);
    console.log(`Building project...`);
    await exec(`yarn --cwd ${repoDir} build`);
    console.log(`Copying project to host...`);
    await exec(`cp -r ${repoDir}/public /output`);
    console.log('Build complete and exported!');
  } catch (error) {
    console.log(error);
  }
};
buildAndExport();

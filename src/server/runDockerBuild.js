const runDockerBuild = async (repoName, repoDir, userDir) => {
  // Build docker image
  console.log('Building docker image...');
  await exec(
    `sudo docker build ${userDir} -t build-app --build-arg REPO_NAME=${repoName} -f ${userDir}/Dockerfile`,
  );

  // Run container, mount userDir as volume mapped to output folder in container
  console.log('Building app in container...');
  await exec(
    `sudo docker run --name build -p 6000-6000 --rm -v ${repoDir}:/output build-app`,
  );
};

module.exports = runDockerBuild;

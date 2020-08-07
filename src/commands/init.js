const uuid = require('uuid');
const { createBuckets, setBucketNotificationConfig } = require('../aws/s3');
const { initJadeLambdas } = require('../aws/lambda');
const { createCloudfrontDistribution } = require('../aws/cloudfront');

const {
  createDirectory,
  exists,
  join,
  createJSONFile,
  readJSONFile,
  readConfig,
  writeConfig,
  getJadePath,
} = require('../util/fileUtils');
const { jadeLog, jadeErr } = require('../util/logger');
const { build } = require('./build');
const {
  initialQuestions,
  gitQuestions,
  noGitAlert,
  confirmResponses,
} = require('../util/questions');
const {
  awsCredentialsConfigured,
  validateBucketCreation,
} = require('../util/validations');
const { s3BucketName } = require('../templates/constants');


const parseName = (name) => {
  return name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
};

const start = async (directory, { projectName, bucketName, gitUrl }) => {
  let bucketNames = [];
  const jadePath = getJadePath(directory);
  if (await exists(join(jadePath, `${s3BucketName}.json`))) {
    bucketNames = await readJSONFile(s3BucketName, jadePath);
  }
  await createJSONFile(s3BucketName, jadePath, [
    ...bucketNames,
    { projectName, bucketName, gitUrl },
  ]);

  await createBuckets(bucketName);

  const lambdaArn = await initJadeLambdas(bucketName);
  await createCloudfrontDistribution(bucketName);
  await setBucketNotificationConfig(bucketName, lambdaArn);
  await build(bucketName);
};

const init = async (directory) => {
  try {
    let config = [];
    if (!awsCredentialsConfigured()) return;
    const jadePath = join(directory, '.jade');
    if (!(await exists(jadePath))) {
      await createDirectory('.jade', directory);
    }
    if (!(await exists(join(jadePath, 'config.json')))) {
      await writeConfig(directory, config);
    } else {
      config = await readConfig(directory);
    }

    const initialAns = await initialQuestions(config);

    if (initialAns.gitExists) {
      const gitAns = await gitQuestions(initialAns);
      const bucketName = `${parseName(initialAns.projectName)}-${uuid.v4()}`;
      if (!(await validateBucketCreation(bucketName))) {
        const projectData = { ...initialAns, ...gitAns, bucketName };
        const newConfig = [...config, projectData];
        await writeConfig(directory, newConfig);
        const proceed = await confirmResponses(projectData);
        if (proceed) {
          jadeLog('Thank you! The Jade framework will now be setup.');
          await start(directory, projectData);
        } else {
          jadeLog('Please run this `jade init` again to restart.');
        }
      } else {
        jadeLog(
          'Sorry, your project name did not generate a valid AWS bucket. Please try again.',
        );
      }
    } else {
      await noGitAlert();
    }
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

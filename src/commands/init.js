const uuid = require('uuid');
const { createBuckets, setBucketNotificationConfig } = require('../aws/s3');
const { initJadeLambdas } = require('../aws/lambda');
const { createCloudFrontDistribution } = require('../aws/cloudfront');

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
const {
  lambdaNames,
  s3BucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
} = require('../templates/constants');
const { getBucketNames, parseName } = require('../util/helpers');

const start = async (
  directory,
  { projectName, bucketName, gitUrl, cloudFrontOriginId },
) => {
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
  await createCloudFrontDistribution(bucketName, cloudFrontOriginId);
  // await setBucketNotificationConfig(bucketName, lambdaArn);
  // await build(bucketName);
};

const init = async (directory) => {
  try {
    let config = [];
    // use a validation here
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
        const projectData = {
          ...initialAns,
          ...gitAns,
          bucketName,
          bucketNames: getBucketNames(bucketName),
          lambdaNames,
          cloudFrontOriginId: cloudFrontOriginId(bucketName),
          cloudFrontOriginDomain: cloudFrontOriginDomain(bucketName),
          createdOn: new Date(),
        };
        const newConfig = [...config, projectData];
        const proceed = await confirmResponses(projectData);
        if (proceed) {
          await writeConfig(directory, newConfig);
          jadeLog('Thank you! The Jade framework will now be setup.');
          await start(directory, projectData);
        } else {
          jadeLog('Please run `jade init` again to restart.');
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

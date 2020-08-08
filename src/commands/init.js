const uuid = require('uuid');
const { createBuckets, setBucketNotificationConfig } = require('../aws/s3');
const { initJadeLambdas } = require('../aws/lambda');
const { createCloudFrontDistribution } = require('../aws/cloudfront');
const { addUserToJadeGroup, createJadeIamGroup } = require('../aws/iam');

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
const { jadeLog, jadeErr, jadeWarn } = require('../util/logger');
const { build } = require('./build');
const {
  initialQuestions,
  gitQuestions,
  noGitAlert,
  confirmResponses,
} = require('../util/questions');
const {
  validateBucketCreation,
  validateUserPermissions,
} = require('../util/validations');
const {
  lambdaNames,
  s3BucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
} = require('../templates/constants');
const { getBucketNames, parseName } = require('../util/helpers');

// write CF ID into config, then upload to DDB
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
  await createCloudFrontDistribution(bucketName);
  await setBucketNotificationConfig(bucketName, lambdaArn);
  await build(bucketName);
};

const validateUser = async () => {
  jadeLog('Checking if your AWS account is correctly setup...');
  const invalidUser = await validateUserPermissions();
  if (invalidUser) {
    jadeWarn(invalidUser);
    return false;
  } else {
    jadeLog('AWS permissions ready.');
    return true;
  }
};

const setupConfig = async (directory) => {
  const jadePath = join(directory, '.jade');
  let config = [];

  if (!(await exists(jadePath))) {
    await createDirectory('.jade', directory);
  }
  if (!(await exists(join(jadePath, 'config.json')))) {
    await writeConfig(directory, config);
  } else {
    config = await readConfig(directory);
  }
  return config;
};

const init = async (directory) => {
  try {
    const isValid = await validateUser();
    if (!isValid) return;

    const config = await setupConfig(directory);
    const initialAns = await initialQuestions(config);

    if (initialAns.gitExists) {
      const gitAns = await gitQuestions(initialAns);
      const bucketName = `${parseName(initialAns.projectName)}-${uuid.v4()}`;
      const invalidBucketName = await validateBucketCreation(bucketName);
      if (invalidBucketName) {
        jadeWarn(invalidBucketName);
      } else {
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
        const proceed = await confirmResponses(projectData);

        if (proceed) {
          jadeLog('Thank you! The Jade framework will now be setup.');
          const newConfig = [...config, projectData];
          await writeConfig(directory, newConfig);
          await createJadeIamGroup();
          await addUserToJadeGroup();
          await start(directory, projectData);
        } else {
          jadeLog('Please run `jade init` again to restart Jade setup.');
        }
      }
    } else {
      await noGitAlert();
    }
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

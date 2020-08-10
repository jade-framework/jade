const uuid = require('uuid');

const { createBuckets, setBucketNotificationConfig } = require('../aws/s3');
const { initJadeLambdas } = require('../aws/lambda');
const { createCloudFrontDistribution } = require('../aws/cloudfront');
const {
  addUserToJadeGroup,
  configEc2IamRole,
  createJadeIamGroup,
} = require('../aws/iam');
const { createAndConfigEc2 } = require('../aws/ec2');
const {
  installEc2JadeEnvironment,
} = require('../aws/ec2/installEc2JadeEnvironment');

const { printBuildSuccess } = require('./printBuildSuccess');
const {
  initialInitQuestions,
  initialAddQuestions,
  gitQuestions,
  confirmResponses,
} = require('./questions');
const {
  validateBucketCreation,
  validateUserPermissions,
  validateInitialInput,
  validateGitInput,
} = require('./validations');
const {
  cwd,
  lambdaNames,
  s3BucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
} = require('../templates/constants');
const {
  createJSONFile,
  readJSONFile,
  createDirectory,
  exists,
  join,
  readConfig,
  writeConfig,
  getJadePath,
} = require('./fileUtils');
const { getBucketNames, getGitFolder, parseName } = require('./helpers');
const { jadeLog, jadeWarn, jadeErr } = require('./logger');

const getUserProjectData = async (command) => {
  try {
    let initialQuestions;
    if (command === 'add') {
      initialQuestions = initialAddQuestions;
    } else if (command === 'init') {
      initialQuestions = initialInitQuestions;
    }
    const config = await getConfig();
    let initialAns = await initialQuestions();

    const invalidInitialAns = await validateInitialInput({
      ...initialAns,
      config,
    });
    if (invalidInitialAns) {
      jadeWarn(invalidInitialAns);
      return false;
    }

    const gitAns = await gitQuestions(initialAns);

    const invalidGitAns = await validateGitInput({ ...gitAns, config });
    if (invalidGitAns) {
      jadeWarn(invalidGitAns);
      return false;
    }

    const bucketName = `${parseName(initialAns.projectName)}-${uuid.v4()}`;
    const invalidBucketName = await validateBucketCreation(bucketName);
    if (invalidBucketName) {
      jadeWarn(invalidBucketName);
      return false;
    }

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
    projectData.gitFolder = getGitFolder(projectData.gitUrl);

    const proceed = await confirmResponses(projectData);
    if (!proceed) {
      jadeLog(`Please run "jade ${command}" again to restart Jade setup.`);
      return false;
    } else {
      return projectData;
    }
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const validateUser = async () => {
  try {
    jadeLog('Checking if your AWS account is correctly setup...');
    const invalidUser = await validateUserPermissions();
    if (invalidUser) {
      jadeErr(invalidUser);
      return false;
    } else {
      jadeLog('AWS account is correctly setup.');
      return true;
    }
  } catch (err) {
    jadeErr(err);
    throw err;
  }
};

const updateBucketData = async (directory, projectData) => {
  let bucketData = [];
  try {
    if (await exists(join(directory, `${s3BucketName}.json`))) {
      bucketData = await readJSONFile(s3BucketName, directory);
      bucketData = bucketData.filter(
        (bucket) => bucket.projectName !== projectData.projectName,
      );
    }
    await createJSONFile(s3BucketName, directory, [...bucketData, projectData]);
    return true;
  } catch (err) {
    jadeErr(err);
    throw err;
  }
};

const setupApp = async (directory, projectData) => {
  try {
    const jadePath = getJadePath(directory);
    const { bucketName } = projectData;

    await createJadeIamGroup();
    await addUserToJadeGroup();

    const bucketData = await updateBucketData(jadePath, projectData);
    if (!bucketData) return false;

    await createBuckets(bucketName);

    const lambdaArn = await initJadeLambdas(bucketName);
    await createCloudFrontDistribution(bucketName);
    await setBucketNotificationConfig(bucketName, lambdaArn);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const setupConfig = async (directory, projectData) => {
  const jadePath = getJadePath(directory);
  let config = [];

  try {
    if (!(await exists(jadePath))) {
      await createDirectory('.jade', directory);
    }
    if (!(await exists(join(jadePath, 'config.json')))) {
      await writeConfig(directory, config);
    } else {
      config = await readConfig(directory);
    }

    const newConfig = [...config, projectData];
    await writeConfig(directory, newConfig);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const getConfig = async (directory = cwd) => {
  let config = [];
  if (await exists(join(getJadePath(directory), 'config.json'))) {
    config = await readConfig(directory);
  }
  return config;
};

const setupAwsInfra = async (bucketName) => {
  try {
    await configEc2IamRole();
    await createAndConfigEc2();
    await installEc2JadeEnvironment(bucketName);
    await printBuildSuccess();
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = {
  getUserProjectData,
  validateUser,
  setupApp,
  setupConfig,
  setupAwsInfra,
};

const crypto = require('crypto');

const { createBuckets, setBucketNotificationConfig } = require('../aws/s3');
const { initJadeLambdas } = require('../aws/lambda');
const {
  createCloudFrontDistribution,
  getCloudFrontDistributionId,
} = require('../aws/cloudfront');
const {
  addUserToJadeGroup,
  configEc2IamRole,
  createJadeIamGroup,
} = require('../aws/iam');
const { createAndConfigEc2, installEc2JadeEnvironment } = require('../aws/ec2');
const { initDynamo, addAppToDynamo } = require('../aws/dynamo');

const { printBuildSuccess } = require('./messages');
const {
  initialInitQuestions,
  initialAddQuestions,
  appConfigQuestions,
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
  cloudFrontOriginId,
  cloudFrontOriginDomain,
} = require('../templates/constants');
const {
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

    const appConfigAns = await appConfigQuestions(initialAns);

    const invalidAppConfig = await validateGitInput({
      ...appConfigAns,
      config,
    });
    if (invalidAppConfig) {
      jadeWarn(invalidAppConfig);
      return false;
    }

    const uniqueId = crypto.randomBytes(16).toString('hex');
    const bucketName = `${parseName(initialAns.projectName)}-${uniqueId}`;
    const invalidBucketName = await validateBucketCreation(bucketName);
    if (invalidBucketName) {
      jadeWarn(invalidBucketName);
      return false;
    }

    const projectData = {
      ...initialAns,
      ...appConfigAns,
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

// const updateBucketData = async (directory, projectData) => {
//   try {
//     const jadePath = getJadePath(directory);

//     return true;
//   } catch (err) {
//     jadeErr(err);
//     return false;
//   }
// };

const setupApp = async (directory, projectData) => {
  try {
    const { bucketName } = projectData;
    await createJadeIamGroup();
    await addUserToJadeGroup();

    await createDirectory('.jade', directory);

    // const bucketData = await updateBucketData(directory, projectData);
    // if (!bucketData) return false;

    await createBuckets(bucketName);

    const lambdaArn = await initJadeLambdas(bucketName, directory);
    const cfd = await createCloudFrontDistribution(bucketName);
    if (!cfd) return;

    const { originId } = cfd;
    const { DomainName } = cfd.Distribution;

    const cloudFrontDistributionId = await getCloudFrontDistributionId(
      originId,
    );
    projectData.cloudFrontDistributionId = cloudFrontDistributionId;
    projectData.cloudFrontDomainName = DomainName;

    await setBucketNotificationConfig(bucketName, lambdaArn);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

// const setupConfig = async (directory, projectData) => {
//   const jadePath = getJadePath(directory);
//   let config = [];

//   try {
//     if (!(await exists(join(jadePath, 'config.json')))) {
//       await writeConfig(directory, config);
//     } else {
//       config = await readConfig(directory);
//     }

//     const newConfig = [...config, projectData];
//     await writeConfig(directory, newConfig);
//     return true;
//   } catch (err) {
//     jadeErr(err);
//     return false;
//   }
// };

const getConfig = async (directory = cwd) => {
  let config = [];
  if (await exists(join(getJadePath(directory), 'config.json'))) {
    config = await readConfig(directory);
  }
  return config;
};

// const getConfigByBucketName = async (bucketName) => {
//   try {
//     let config = [];
//     if (await exists(join(getJadePath(directory), 'config.json'))) {
//       config = await readConfig(directory);
//     }
//     return config.find((proj) => proj.bucketName === bucketName)[0];
//   } catch (err) {
//     jadeErr(err);
//     return false;
//   }
// };

const setupAwsInfra = async (projectData) => {
  try {
    await configEc2IamRole(projectData);
    await createAndConfigEc2(projectData);
    await installEc2JadeEnvironment(projectData);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const userMsg = (command) => {
  if (command === 'add') {
    return 'Thank you! Your new Jade app will now be setup.';
  } else if (command === 'init') {
    return 'Thank you! The Jade framework will now be setup.';
  }
};

const launchApp = async (command, directory) => {
  const projectData = await getUserProjectData(command);
  if (!projectData) return;

  jadeLog(userMsg(command));
  const isAppSetup = await setupApp(directory, projectData);
  if (!isAppSetup) return;

  await setupAwsInfra(projectData);
  if (command === 'init') {
    await initDynamo(projectData);
  } else if (command === 'add') {
    await addAppToDynamo(projectData);
  }
  await printBuildSuccess(projectData);
};

module.exports = {
  launchApp,
};

const uuid = require('uuid');
const path = require('path');
const {
  createBuckets,
  uploadToBucket,
  setBucketNotificationConfig,
} = require('../aws/s3');
const {
  createLambdaFunction,
  createLambdaPermission,
  createLambdaRole,
  lambdaExists,
} = require('../aws/lambda');
const { createCloudfrontDistribution } = require('../aws/cloudfront');
const { roleExists } = require('../aws/iam');
const {
  asyncIamWaitFor,
  asyncGetCallerIdentity,
} = require('../aws/awsAsyncFunctions');

const {
  createDirectory,
  sleep,
  exists,
  join,
  createJSONFile,
  readJSONFile,
  readConfig,
  writeConfig,
  getJadePath,
} = require('../util/fileUtils');
const { zipit } = require('../util/zipit');
const { jadeLog, jadeErr } = require('../util/logger');
const { build } = require('./build');
const { prompt } = require('../util/prompt');
const {
  promptProjectName,
  promptGitUrl,
  validateBucketCreation,
} = require('../util/validations');
const { lambdaIamRoleName, lambdaNames } = require('../templates/constants');

const gitRepos = ['GitHub', 'GitLab', 'Bitbucket'];

const initJadeLambdas = async (bucketName) => {
  const functionName = lambdaNames;
  const functionFile = `${functionName}.js.zip`;
  const functionHandler = `${functionName}.handler`;
  const functionDescription = `Invalidate index.html in Cloudfront on upload to S3.`;

  try {
    await zipit(
      `${functionName}.js`,
      join(
        path.resolve(path.dirname('.')),
        'src',
        'aws',
        'lambda',
        `${functionName}.js`,
      ),
    );
    await uploadToBucket(functionFile, `${bucketName}-lambda`);

    let lambdaRoleResponse = await roleExists(lambdaIamRoleName);
    if (!lambdaRoleResponse) {
      lambdaRoleResponse = await createLambdaRole(lambdaIamRoleName);
      console.log('Waiting for Lambda role to be ready...');
      await asyncIamWaitFor('roleExists', { RoleName: lambdaIamRoleName });
      await sleep(5000);
      console.log('Lambda role ready.');
    }
    let lambdaResponse = await lambdaExists(functionName);
    let lambdaArn;
    if (!lambdaResponse) {
      lambdaResponse = await createLambdaFunction(
        `${bucketName}-lambda`,
        functionFile,
        functionName,
        functionHandler,
        functionDescription,
        lambdaRoleResponse.Role.Arn,
      );
      lambdaArn = lambdaResponse.FunctionArn;
      const { Account } = await asyncGetCallerIdentity();
      const lambdaPermissionParams = {
        Action: 'lambda:InvokeFunction',
        FunctionName: lambdaArn,
        Principal: 's3.amazonaws.com',
        SourceAccount: Account,
        StatementId: `example-S3-permission`,
      };
      await createLambdaPermission(lambdaPermissionParams);
    } else {
      lambdaResponse = lambdaResponse.Configuration;
      lambdaArn = lambdaResponse.FunctionArn;
    }
    return lambdaArn;
  } catch (err) {
    console.log(err);
  }
};

const parseName = (name) => {
  name = name.replace(/\s+/gi, '-').toLowerCase();
  return name.replace(/[^a-z0-9]/gi, '');
};

const start = async (directory, { projectName, bucketName, gitUrl }) => {
  let bucketNames = [];
  const jadePath = getJadePath(directory);
  if (await exists(join(jadePath, 's3BucketName.json'))) {
    bucketNames = await readJSONFile('s3BucketName', jadePath);
  }
  await createJSONFile('s3BucketName', jadePath, [
    ...bucketNames,
    { projectName, bucketName, gitUrl },
  ]);

  await createBuckets(bucketName);

  const lambdaArn = await initJadeLambdas(bucketName);
  await createCloudfrontDistribution(bucketName);
  await setBucketNotificationConfig(bucketName, lambdaArn);
  await build(bucketName);
};

const initialQuestions = async (config) => {
  const questions = [
    {
      message: 'What is your project name?\n',
      name: 'projectName',
      default: config.projectName || 'My Jade Project',
      validate: (input) => {
        return promptProjectName(input);
      },
    },
    {
      type: 'list',
      message: "What's your favorite Git collaboration tool?\n",
      name: 'gitProvider',
      choices: gitRepos,
      default: config.gitProvider || 'GitHub',
    },
    {
      type: 'confirm',
      message: (answers) => {
        return `Do you currently have a ${answers.gitProvider} repo?\n`;
      },
      name: 'gitExists',
      default: true,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const gitQuestions = async (initialAns) => {
  const questions = [
    {
      name: 'gitUrl',
      message: `Please enter your ${initialAns.gitProvider} URL here:\n`,
      validate: (input) => {
        return promptGitUrl(input);
      },
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const noGitAlert = async () => {
  await prompt([
    {
      name: 'noGit',
      message: `Thank you for using Jade. To continue, please setup a Git repository with one of these providers: ${gitRepos.join(
        ' | ',
      )}\n\x1b[30;0mPress any key to continue...`,
    },
  ]);
};

const init = async (directory) => {
  try {
    let config = [];
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
        jadeLog('Thank you! The Jade framework will now be setup.');
        await start(directory, projectData);
      } else {
        jadeLog(
          'Sorry your project name does not generate a valid AWS bucket. Please try again.',
        );
      }
    } else {
      await noGitAlert();
    }

    // Implement some kind of check for the user "is this info correct?"
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

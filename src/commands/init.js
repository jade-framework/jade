const uuid = require('uuid');
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
  exists,
  join,
  createJSONFile,
  readConfig,
  writeConfig,
} = require('../util/fileUtils');
const { zipit } = require('../util/zipit');
const { jadeLog, jadeErr } = require('../util/logger');
const { build } = require('./build');
const { prompt } = require('../util/prompt');
const { validateProjectName, validateGitUrl } = require('../util/validations');
const { lambdaIamRoleName, jadeLambdaName } = require('../templates/constants');

const cwd = process.cwd();
const gitRepos = ['GitHub', 'GitLab', 'Bitbucket'];

// const init = async () => {
//   await createDirectory(".jade", cwd);
//   const bucketName = `test-${uuid.v4()}`;
//   await createBuckets(bucketName);
// await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
// await uploadToBucket(functionFile, `${bucketName}-lambda`);
//   const lambdaRoleResponse = await createLambdaRole(lambdaIamRoleName);
//   setTimeout(async () => {
//     const lambdaResponse = await createLambdaFunction(
//       `${bucketName}-lambda`,
//       functionFile,
//       functionName,
//       functionHandler,
//       functionDescription,
//       lambdaRoleResponse.Role.Arn
//     );
//     const lambdaArn = lambdaResponse.FunctionArn;
//     await createLambdaPermission(process.env.sourceAccount, lambdaArn);
//     await createCloudfrontDistribution(bucketName);
//     await setBucketNotificationConfig(bucketName, lambdaArn);
//     /*** START INIT EC2 INSTANCE HERE ***/
//     await build(bucketName);
//   }, 10000); // It takes time for the IAM role to be replicated through all regions and become valid
// };
/* start function
- initialize .jade folder
- store bucketName in config file
- create Jade S3 buckets (incl. roles)
- create Jade Lambdas (incl. roles)
- create CloudFront (incl. roles)
- link S3 to CloudFront
- create EC2
- initialize EC2 files
- SFTP files and SSH commands into EC2 instance
- includes initial build and dump into S3 
*/

const initJadeLambdas = async (bucketName) => {
  const functionName = jadeLambdaName;
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
      console.log('Lambda role ready.');
    }

    let lambdaResponse = await lambdaExists(functionName);
    if (!lambdaResponse) {
      lambdaResponse = await createLambdaFunction(
        `${bucketName}-lambda`,
        functionFile,
        functionName,
        functionHandler,
        functionDescription,
        lambdaRoleResponse.Role.Arn,
      );
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
    }

    const lambdaArn = lambdaResponse.FunctionArn;
    return lambdaArn;
  } catch (err) {
    console.log(err);
  }
};

const parseName = (name) => {
  return name.replace(/\s+/gi, '-');
};

const start = async (jadePath, { projectName }) => {
  let bucketName;
  if (exists(join(jadePath, 's3BucketName.json'))) {
    const bucketJson = await readJSONFile('s3BucketName', jadePath);
    existingProjectName = bucketJson.projectName;
    if (projectName === bucketName) {
      jadeErr(
        `The name ${projectName} is already in use. Please enter a new name`,
      );
      return;
    }
  } else {
    bucketName = `${projectName}-${uuid.v4()}`;
    await createBuckets(bucketName);
    await createJSONFile('s3BucketName', jadePath, { projectName, bucketName });
  }
  const lambdaArn = await initJadeLambdas(bucketName);
  console.log(lambdaArn);
  // await createCloudfrontDistribution(bucketName);
  // await setBucketNotificationConfig(bucketName, lambdaArn);
  // await build();
};

const initialQuestions = async (config) => {
  const questions = [
    {
      message: 'What is your project name?\n',
      name: 'projectName',
      default: config.projectName || 'My Jade Project',
      // validate: (input) => {
      //   return validateProjectName({ projectName: input });
      // },
      filter: (input) => {
        return parseName(input);
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
        return validateGitUrl({ gitUrl: input });
      },
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const init = async (directory) => {
  try {
    let config = {};
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
      const combinedAns = { ...initialAns, ...gitAns };
      const invalid = await validateUserInitInput(combinedAns);
      if (invalid) {
        jadeErr(invalid);
        return;
      }
      await writeConfig(directory, combinedAns);
      jadeLog('Thank you! The Jade framework will now be setup.');
      await start(jadePath, initialAns);
    } else {
      // const gitWalkthrough = await prompt();
      await prompt([
        {
          name: 'noGit',
          message: `Thank you for using Jade. To continue, please setup a Git repository with one of these providers: ${gitRepos.join(
            ' | ',
          )}\n\x1b[30;0mPress any key to continue...`,
        },
      ]);
    }

    // Implement some kind of check for the user "is this info correct?"
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { init };

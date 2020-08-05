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
} = require("../aws/lambda");
const { createCloudfrontDistribution } = require("../aws/cloudfront");

const {
  createDirectory,
  exists,
  join,
  createJSONFile,
  readConfig,
  writeConfig,
} = require("../util/fileUtils");
const { zipit } = require("../util/zipit");
const { jadeLog, jadeErr } = require("../util/logger");
const { build } = require("./build");
const { prompt } = require("./prompt");

const cwd = process.cwd();
const functionName = 'copyToBucket';
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Copy a file from src to dest buckets.`;
const gitRepos = ["GitHub", "GitLab", "Bitbucket"];

// const init = async () => {
//   await createDirectory(".jade", cwd);
//   const bucketName = `test-${uuid.v4()}`;
//   await createBuckets(bucketName);
// await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
// await uploadToBucket(functionFile, `${bucketName}-lambda`);
//   const lambdaRoleResponse = await createLambdaRole("lambda-s3-role-2");
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
  await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
  await uploadToBucket(functionFile, `${bucketName}-lambda`);
  const lambdaRoleResponse = await createLambdaRole("lambda-s3-role-2");
  return new Promise((resolve) =>
    setTimeout(async () => {
      const lambdaResponse = await createLambdaFunction(
        `${bucketName}-lambda`,
        functionFile,
        functionName,
        functionHandler,
        functionDescription,
        lambdaRoleResponse.Role.Arn
      );
      const lambdaArn = lambdaResponse.FunctionArn;
      const sourceAccount = process.env.sourceAccount;
      const lambdaPermissionParams = {
        Action: "lambda:InvokeFunction",
        FunctionName: lambdaArn,
        Principal: "s3.amazonaws.com",
        SourceAccount: sourceAccount,
        StatementId: `example-S3-permission`,
      };
      await createLambdaPermission(lambdaPermissionParams);
      resolve(lambdaArn);
    }, 10000)
  ); // It takes time for the IAM role to be replicated through all regions and become valid
};

const start = async (jadePath) => {
  const bucketName = `jade-${uuid.v4()}`;
  await createBuckets(bucketName);
  await createJSONFile("s3BucketName", jadePath, { bucketName });
  const lambdaArn = await initJadeLambdas(bucketName);
  await createCloudfrontDistribution(bucketName);
  await setBucketNotificationConfig(bucketName, lambdaArn);
  await build();
};

const initialQuestions = async (config) => {
  const questions = [
    {
      message: "What is your project name?\n",
      name: "projectName",
      default: config.projectName || "My Jade Project",
    },
    {
      type: "list",
      message: "What's your favorite Git collaboration tool?\n",
      name: "gitProvider",
      choices: gitRepos,
      default: config.gitProvider || "GitHub",
    },
    {
      type: "confirm",
      message: (answers) => {
        return `Do you currently have a ${answers.gitProvider} repo?\n`;
      },
      name: "gitExists",
      default: true,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const gitQuestions = async (initialAns) => {
  const gitQuestions = [
    {
      name: "gitUrl",
      message: `Please enter your ${initialAns.gitProvider} URL here:\n`,
      // validates: // to be validated
    },
  ];
  const answers = await prompt(gitQuestions);
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
      await writeConfig(directory, { ...initialAns, ...gitAns });
      jadeLog("Thank you! The Jade framework will now be setup.");
      await start(jadePath);
    } else {
      // const gitWalkthrough = await prompt();
      await prompt([
        {
          name: "noGit",
          message: `Thank you for using Jade. To continue, please setup a Git repository at one of these providers: ${gitRepos.join(
            " | "
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

init(cwd);

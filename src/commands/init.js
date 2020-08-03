const uuid = require("uuid");
const {
  createBuckets,
  uploadToBucket,
  setBucketNotificationConfig,
} = require("../aws/s3");
const {
  createLambdaFunction,
  createLambdaPermission,
  createLambdaRole,
} = require("../aws/lambda");
const {
  createDirectory,
  exists,
  join,
  readConfig,
  writeConfig,
} = require("../util/fileUtils");
const { createCloudfrontDistribution } = require("../aws/cloudfront");
const { zipit } = require("../util/zipit");
const { build } = require("./build");
const inquirer = require("inquirer");

const cwd = process.cwd();
const functionName = "copyToBucket";
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Copy a file from src to dest buckets.`;
const prompt = inquirer.createPromptModule();

// const init = async () => {
//   await createDirectory(".jade", cwd);
//   const bucketName = `test-${uuid.v4()}`;
//   await createBuckets(bucketName);
//   await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
//   await uploadToBucket(functionFile, `${bucketName}-lambda`);
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

const start = async (directory) => {
  await createDirectory(".jade", directory);
  const bucketName = `jade-${uuid.v4()}`;
  await createBuckets(bucketName);
  const lambdaRoleResponse = await createLambdaRole("lambda-s3-role-2");
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
    await createLambdaPermission(process.env.sourceAccount, lambdaArn);
    await createCloudfrontDistribution(bucketName);
    await setBucketNotificationConfig(bucketName, lambdaArn);
    /*** START INIT EC2 INSTANCE HERE ***/
    await build(bucketName);
  }, 10000); // It takes time for the IAM role to be replicated through all regions and become valid
};

const init = async (args, directory) => {
  try {
    let config = {};
    const jadePath = join(directory, ".jade");
    if (!(await exists(jadePath))) {
      await createDirectory(".jade", directory);
    }
    if (!(await exists(join(jadePath, "config.json")))) {
      await writeConfig(directory, config);
    } else {
      config = await readConfig(directory);
    }
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
        choices: ["GitHub", "GitLab", "Bitbucket"],
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

    const gitExists = answers.gitExists;
    if (gitExists) {
      const gitQuestions = [
        {
          name: "gitUrl",
          message: `Please enter your ${answers.gitProvider} URL here:\n`,
          // validates: // to be validated
        },
      ];
      const gitAnswers = await prompt(gitQuestions);
      // console.log("exists", gitAnswers);
      console.log("Thank you! The Jade framework will now be setup.");
    } else {
      // const gitWalkthrough = await prompt();
      console.log("doesn't exist");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { init };

init("hello", process.cwd());

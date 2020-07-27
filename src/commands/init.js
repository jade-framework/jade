const uuid = require("uuid");
const path = require("path");
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
const { createCloudfrontDistribution } = require("../aws/cloudfront");
const { zipit } = require("../util/zipit");
const { build } = require("./build");

const cwd = process.cwd();
const functionName = "copyToBucket";
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Copy a file from src to dest buckets.`;

const init = async () => {
  const bucketName = `test-${uuid.v4()}`;
  await createBuckets(bucketName);
  await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
  await uploadToBucket(functionFile, `${bucketName}-lambda`);
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

    // uploadToBucket("index.html", bucketName);
  }, 10000); // It takes time for the IAM role to be replicated through all regions and become valid
};

module.exports = { init };
init();

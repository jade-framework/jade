const uuid = require('uuid');
const {
  createBuckets,
  uploadToBucket,
  setBucketNotificationConfig,
} = require('../aws/s3');
const { createBucket } = require('../aws/s3/createBucket');
const { updateBucketPolicy } = require('../aws/s3/updateBucketPolicy');
const {
  createCloudfrontDistribution,
} = require('../aws/cloudfront/createCloudfrontDistribution');
const {
  updateCloudfrontDistribution,
} = require('../aws/cloudfront/updateCloudfrontDistribution');
const { zipit } = require('../util/zipit');
const { createLambdaRole } = require('../aws/lambda/createLambdaRole');
const { createLambdaFunction } = require('../aws/lambda/createLambdaFunction');
const {
  createLambdaPermission,
} = require('../aws/lambda/createLambdaPermission');
const cwd = process.cwd();

const bucketName = 'test-0a9394f7-6e3c-4442-84f5-1fb91f81c18d';
const functionName = 'invalidateCloudfrontFile';
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Invalidate file in Cloudfront.`;

// const createBuckets = async bucketName => {
//   await createBucket(`${bucketName}`);
//   updateBucketPolicy(`${bucketName}`);
// };
// createBuckets(`test-${uuid.v4()}`);
// updateCloudfrontDistribution('EL5J0YDK2X0IH');
const init = async () => {
  createCloudfrontDistribution('test-398e95ce-925e-4c10-99c3-7d94b837498b');
  // const bucketName = `test-${uuid.v4()}`;
  // await createBuckets(bucketName);
  // await createCloudfrontDistribution(bucketName);
  // await zipit(`${functionName}.js`, `${cwd}/src/aws/lambda/${functionName}.js`);
  // await uploadToBucket(functionFile, `${bucketName}-lambda`);
  // const lambdaRoleResponse = await createLambdaRole('lambda-s3-role-2');
  // setTimeout(async () => {
  //   const lambdaResponse = await createLambdaFunction(
  //     `${bucketName}-lambda`,
  //     functionFile,
  //     functionName,
  //     functionHandler,
  //     functionDescription,
  //     lambdaRoleResponse.Role.Arn
  //   );
  //   const lambdaArn = lambdaResponse.FunctionArn;
  //   await createLambdaPermission(process.env.sourceAccount, lambdaArn);
  //   await setBucketNotificationConfig(bucketName, lambdaArn);
  // }, 10000);
};
init();

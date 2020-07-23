const uuid = require('uuid');
const {
  createBucket,
  updateBucketPolicy,
  uploadToBucket,
  setBucketNotificationConfig,
} = require('../aws/s3');
const {
  createLambdaFunction,
  createLambdaPermission,
} = require('../aws/lambda');
const { createCloudfrontDistribution } = require('../aws/cloudfront');
const { zipit } = require('../util/zipit');

const cwd = process.cwd();
const bucketName = `test-${uuid.v4()}`;
const functionName = 'copyToBucket';
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Copy a file from src to dest buckets.`;
const lambdaRole = 'arn:aws:iam::434812305662:role/lambda-s3-role';

(async () => {
  zipit(`${functionName}.js`, `${cwd}/../aws/lambda/${functionName}.js`);
  // await createBucket(`${bucketName}`);
  // await createBucket(`${bucketName}-copy`);
  // await createBucket(`${bucketName}-lambda`);
  // await updateBucketPolicy(`${bucketName}`);
  // await updateBucketPolicy(`${bucketName}-copy`);
  // await updateBucketPolicy(`${bucketName}-lambda`);
  // await uploadToBucket(functionFile, `${bucketName}-lambda`);
  // const lambdaResponse = await createLambdaFunction(
  //   `${bucketName}-lambda`,
  //   functionFile,
  //   functionName,
  //   functionHandler,
  //   functionDescription,
  //   lambdaRole
  // );
  // const lambdaArn = lambdaResponse.FunctionArn;
  // await createLambdaPermission(lambdaArn);
  // setBucketNotificationConfig(bucketName, lambdaArn);
  // createCloudfrontDistribution(bucketName);
})();

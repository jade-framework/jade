/**
 * Create 3 S3 buckets, each with a bucket policy to allow public read access
 * Set up a cloudfront distribution connected to bucket #1
 * Upload a Lambda function.zip to bucket # 2
 * Create an IAM role for Lambda
 * Create the Lambda function, pulling the fn from bucket #2
 * Add event to bucket #1 to trigger lambda
 * Upload a file to bucket #1 (should auto-copy to bucket #3)
 */

const uuid = require('uuid');
const { createS3Bucket } = require('../aws/s3/createS3Bucket');
const { updateBucketPolicy } = require('../aws/s3/updateBucketPolicy');
const { uploadToBucket } = require('../aws/s3/uploadToBucket');
const { createLambdaFunction } = require('../aws/lambda/createLambdaFunction');
const {
  createLambdaPermission,
} = require('../aws/lambda/createLambdaPermission');
const {
  setBucketNotificationConfig,
} = require('../aws/s3/setbucketNotificationConfig');
const {
  createCloudfrontDistribution,
} = require('../aws/cloudfront/createCloudfrontDistribution');
const { zipit } = require('../util/zipit');

const bucketName = `test-${uuid.v4()}`;
const functionName = 'copyToBucket';
const functionFile = `${functionName}.js.zip`;
const functionHandler = `${functionName}.handler`;
const functionDescription = `Copy a file from src to dest buckets.`;
const lambdaRole = 'arn:aws:iam::434812305662:role/lambda-s3-role';

(async () => {
  // zipit(`${functionName}.js`, `../aws/lambda/${functionName}.js`);
  console.log(`${functionName}.js`, `../aws/lambda/${functionName}.js`);
  // await createS3Bucket(`${bucketName}`);
  // await createS3Bucket(`${bucketName}-copy`);
  // await createS3Bucket(`${bucketName}-lambda`);
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

/*
  bucketName,
  zipFileName,
  functionName,
  handler,
  description = 'Sample description',
  role = 'arn:aws:iam::434812305662:role/lambda-s3-role'
  */

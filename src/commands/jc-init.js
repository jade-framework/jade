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

const bucketName = `test-${uuid.v4()}`;

(async () => {
  // await createS3Bucket(`${bucketName}`);
  // await createS3Bucket(`${bucketName}-copy`);
  await createS3Bucket(`test-8f1e2ef0-7f09-4dd3-9fb7-14b864086624-copy`);
  // await createS3Bucket(`${bucketName}-lambda`);
  // updateBucketPolicy(`${bucketName}`);
  // updateBucketPolicy(`${bucketName}-copy`);
  // updateBucketPolicy(`${bucketName}-lambda`);
  // uploadToBucket(
  //   'copyToBucket.js.zip',
  //   'test-8f1e2ef0-7f09-4dd3-9fb7-14b864086624'
  // );
  // const lambdaResponse = await createLambdaFunction(
  //   'test-8f1e2ef0-7f09-4dd3-9fb7-14b864086624',
  //   'copyToBucket.js.zip',
  //   'copyToBucket',
  //   'copyToBucket.handler',
  //   'Copy to Bucket',
  //   'arn:aws:iam::434812305662:role/lambda-s3-role'
  // );
  // const lambdaArn = lambdaResponse.FunctionArn;
  // await createLambdaPermission(lambdaArn);
  // setBucketNotificationConfig(
  //   'test-8f1e2ef0-7f09-4dd3-9fb7-14b864086624',
  //   lambdaArn
  // );
})();

/*
  bucketName,
  zipFileName,
  functionName,
  handler,
  description = 'Sample description',
  role = 'arn:aws:iam::434812305662:role/lambda-s3-role'
  */

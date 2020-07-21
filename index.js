/**
 * Creates a new S3 bucket, adds a bucket policy to allow public read acces,
 * and sets up a CloudFront distribution connected to the newly created bucket.
 */

const AWS = require('aws-sdk');
const uuid = require('uuid');
const {
  createS3Bucket,
  uploadFileToS3Bucket,
  updateS3BucketPolicy,
} = require('./src/aws/s3');
const { createCloudfrontDistribution } = require('./src/aws/cloudfront');
const { createLambda, createLambdaRole } = require('./src/aws/lambda');
const { zipit } = require('./src/util/zipit');

// const bucketName = `test-${uuid.v4()}`;
const bucketName = `test-7efd1622-b92f-4771-8b1a-b7fa476491ec`;
const fileToUpload = 'index.html';

(async () => {
  // await createS3Bucket(bucketName);
  // updateS3BucketPolicy(bucketName);
  // await zipit('helloWorld.js', 'src/aws/lambda');
  // uploadFileToS3Bucket(fileToUpload, bucketName);
  // uploadFileToS3Bucket('helloWorld.js.zip', bucketName);
  createLambda(
    bucketName,
    'hello-world',
    'helloWorld',
    'helloWorld.helloHandler',
    'A sample lambda function that logs and returns text'
  );
  // createCloudfrontDistribution(bucketName);
})();

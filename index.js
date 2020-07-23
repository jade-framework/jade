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
const bucketName = `test-b80a4ff0-582b-406d-8b9c-fdd7db0c793b`;
const fileToUpload = 'index.html';

(async () => {
  // await createS3Bucket(bucketName);
  // updateS3BucketPolicy(bucketName);
  // uploadFileToS3Bucket(fileToUpload, bucketName);
  // await zipit('helloWorld.js', 'helloWorld.js');
  // await uploadFileToS3Bucket('helloWorld.js.zip', bucketName);
  // createLambda(
  //   bucketName,
  //   'helloWorld.js.zip',
  //   'helloWorld',
  //   'helloWorld.helloWorld',
  //   'A sample lambda function that logs and returns text'
  // );
  // createCloudfrontDistribution(bucketName);
})();

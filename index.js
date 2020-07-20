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

const bucketName = `test-${uuid.v4()}`;
const fileToUpload = 'index.html';

(async () => {
  await createS3Bucket(bucketName);
  uploadFileToS3Bucket(fileToUpload, bucketName);
  updateS3BucketPolicy(bucketName);
  createCloudfrontDistribution(bucketName);
})();

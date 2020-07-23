// const { promisify } = require('util');
// const S3 = require('aws-sdk/clients/s3');

// const s3 = new S3({ apiVersion: '2006-03-01' });

// const asyncCreateS3Bucket = promisify(s3.createBucket.bind(s3));
// const asyncPutBucketPolicy = promisify(s3.putBucketPolicy.bind(s3));
// const asyncUploadToBucket = promisify(s3.putObject.bind(s3));
// const asyncPutBucketNotificationConfiguration = promisify(
//   s3.putBucketNotificationConfiguration.bind(s3)
// );

// module.exports = {
//   asyncCreateS3Bucket,
//   asyncPutBucketPolicy,
//   asyncUploadToBucket,
//   asyncPutBucketNotificationConfiguration,
// };

const { createBucket } = require('./createBucket');
const { createBuckets } = require('./createBuckets');
const {
  setBucketNotificationConfig,
} = require('./setBucketNotificationConfig');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { uploadToBucket } = require('./uploadToBucket');

module.exports = {
  createBucket,
  createBuckets,
  setBucketNotificationConfig,
  updateBucketPolicy,
  uploadToBucket,
};

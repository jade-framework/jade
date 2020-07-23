const { promisify } = require('util');
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({ apiVersion: '2006-03-01' });

const asyncPutBucketNotificationConfiguration = promisify(
  s3.putBucketNotificationConfiguration.bind(s3)
);

module.exports = {
  asyncPutBucketNotificationConfiguration,
};

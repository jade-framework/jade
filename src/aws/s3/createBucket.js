const {
  asyncCreateS3Bucket,
  asyncPutBucketTagging,
} = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const createBucket = async (bucketName) => {
  jadeLog('Creating S3 Bucket...');

  try {
    const response1 = await asyncCreateS3Bucket({ Bucket: bucketName });
    jadeLog(`S3 Bucket created at ${response1.Location}.`);
    await asyncPutBucketTagging({
      Bucket: bucketName,
      Tagging: { TagSet: [{ Key: 'project', Value: 'jade' }] },
    });
    jadeLog(`Jade project tag added to bucket.`);
  } catch (error) {
    jadeErr('Error creating S3 Bucket', error);
  }
};

module.exports = { createBucket };

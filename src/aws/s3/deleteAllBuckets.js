const { deleteBucket } = require('./deleteBucket');
const {
  asyncListBuckets,
  asyncGetBucketTagging,
} = require('../awsAsyncFunctions');
const { jadeErr, jadeLog } = require('../../util/logger');
const deleteAllBuckets = async () => {
  jadeLog('Deleting ALL Buckets deployed by Jade...');

  try {
    const allBuckets = await asyncListBuckets();
    allBuckets.Buckets.forEach(async (bucket) => {
      try {
        const tags = await asyncGetBucketTagging({ Bucket: bucket.Name });

        if (tags && tags.TagSet[0].Value === 'jade') {
          deleteBucket(bucket.Name);
        }
      } catch (error) {
        if (error.code !== 'NoSuchTagSet') jadeErr(error);
      }
    });
  } catch (error) {
    jadeErr('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteAllBuckets };

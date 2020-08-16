const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { getBucketNames } = require('../../util/helpers');
const { jadeLog, jadeErr } = require('../../util/logger');

const createBuckets = async (bucketName) => {
  try {
    await Promise.all(
      getBucketNames(bucketName).map((name) => {
        return (async () => {
          await createBucket(name);
          await updateBucketPolicy(name);
        })();
      }),
    );
    jadeLog('All S3 buckets created and configured.');
  } catch (error) {
    jadeErr(error);
  }
};

module.exports = {
  createBuckets,
};

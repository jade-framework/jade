const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { getBucketNames } = require('../../util/helpers');

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
    console.log('All S3 buckets created and configured.');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBuckets,
};

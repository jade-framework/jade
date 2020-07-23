const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');

const createBuckets = async bucketName => {
  await createBucket(`${bucketName}`);
  updateBucketPolicy(`${bucketName}`);
  await createBucket(`${bucketName}-copy`);
  updateBucketPolicy(`${bucketName}-copy`);
  await createBucket(`${bucketName}-lambda`);
  await updateBucketPolicy(`${bucketName}-lambda`);
};

module.exports = {
  createBuckets,
};

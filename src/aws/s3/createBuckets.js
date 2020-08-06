const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { putBucketTagging } = require('./putBucketTagging');

const createBuckets = async (bucketName) => {
  await createBucket(`${bucketName}`);
  await updateBucketPolicy(`${bucketName}`);
  // await createBucket(`${bucketName}-copy`);
  // updateBucketPolicy(`${bucketName}-copy`);
  await createBucket(`${bucketName}-lambda`);
  await updateBucketPolicy(`${bucketName}-lambda`);
  await putBucketTagging(`${bucketName}-lambda`, tags);
};

module.exports = {
  createBuckets,
};

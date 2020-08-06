const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { putBucketTagging } = require('./putBucketTagging');

const createBuckets = async (bucketName) => {
  const tags = [{ Key: 'Name', Value: 'Jade' }];
  await createBucket(`${bucketName}`);
  await updateBucketPolicy(`${bucketName}`);
  await putBucketTagging(`${bucketName}`, tags);
  await createBucket(`${bucketName}-copy`);
  await updateBucketPolicy(`${bucketName}-copy`);
  await putBucketTagging(`${bucketName}-copy`, tags);
  await createBucket(`${bucketName}-lambda`);
  await updateBucketPolicy(`${bucketName}-lambda`);
  await putBucketTagging(`${bucketName}-lambda`, tags);
};

module.exports = {
  createBuckets,
};

const { createBucket } = require('./createBucket');
const { updateBucketPolicy } = require('./updateBucketPolicy');

const createBuckets = async (bucketName) => {
<<<<<<< HEAD
  await createBucket(`${bucketName}`);
  await updateBucketPolicy(`${bucketName}`);
  // await createBucket(`${bucketName}-copy`);
  // updateBucketPolicy(`${bucketName}-copy`);
  await createBucket(`${bucketName}-lambda`);
  await updateBucketPolicy(`${bucketName}-lambda`);
=======
  try {
    await createBucket(`${bucketName}`);
    updateBucketPolicy(`${bucketName}`);
    await createBucket(`${bucketName}-builds`);
    updateBucketPolicy(`${bucketName}-builds`);
    // await createBucket(`${bucketName}-staging`);
    // updateBucketPolicy(`${bucketName}-staging`);
    await createBucket(`${bucketName}-lambda`);
    await updateBucketPolicy(`${bucketName}-lambda`);
  } catch (error) {
    console.log(error);
  }
>>>>>>> master
};

module.exports = {
  createBuckets,
};

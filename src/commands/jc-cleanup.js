const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');

const cleanup = async bucketName => {
  deleteAllBuckets();
};

cleanup();

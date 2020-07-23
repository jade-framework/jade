const { deleteBucket } = require('../aws/s3/deleteBucket');

const cleanup = async bucketName => {
  deleteBucket(bucketName);
  deleteBucket(`${bucketName}-copy`);
  deleteBucket(`${bucketName}-lambda`);
};

cleanup(process.argv[2]);

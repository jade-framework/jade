const { asyncDeleteS3Bucket } = require('../awsAsyncFunctions');
const { asyncDeleteBucketObjects } = require('../awsAsyncFunctions');
const { listBucketObjects } = require('./listBucketObjects');
const { jadeLog, jadeErr } = require('../../util/logger');

const deleteBucket = async (bucketName) => {
  try {
    const objects = await listBucketObjects(bucketName);
    let objectKeys;
    if (objects) {
      objectKeys = objects.map((object) => {
        return { Key: object.Key };
      });
    }
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: objectKeys,
      },
    };
    if (objects && objects.length > 0) {
      await asyncDeleteBucketObjects(deleteParams);
    }
    await asyncDeleteS3Bucket({ Bucket: bucketName });
    jadeLog(`S3 Bucket ${bucketName} deleted`);
  } catch (error) {
    jadeErr('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteBucket };

const { asyncDeleteS3Bucket } = require('../awsAsyncFunctions');
const { asyncDeleteBucketObjects } = require('../awsAsyncFunctions');
const { listBucketObjects } = require('./listBucketObjects');

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
    console.log(`S3 Bucket ${bucketName} deleted`);
  } catch (error) {
    console.log('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteBucket };

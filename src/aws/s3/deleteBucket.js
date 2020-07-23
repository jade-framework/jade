const { asyncDeleteS3Bucket } = require('../awsAsyncFunctions');
const { asyncDeleteBucketObjects } = require('../awsAsyncFunctions');
const { listBucketObjects } = require('./listBucketObjects');

const deleteBucket = async bucketName => {
  console.log('Deleting S3 Bucket...');

  try {
    const objects = await listBucketObjects(bucketName);
    const objectKeys = objects.map(object => {
      return { Key: object.Key };
    });
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: objectKeys,
      },
    };
    if (objects.length > 0) await asyncDeleteBucketObjects(deleteParams);
    await asyncDeleteS3Bucket({ Bucket: bucketName });
    console.log(`S3 Bucket ${bucketName} deleted`);
  } catch (error) {
    console.log('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteBucket };

deleteBucket('test-30d6a067-8a00-44ea-8408-45122f179457-copy');

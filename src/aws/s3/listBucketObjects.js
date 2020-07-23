const { asyncListBucketObjects } = require('../awsAsyncFunctions');

const listBucketObjects = async bucketName => {
  try {
    const response = await asyncListBucketObjects({ Bucket: bucketName });
    // console.log(response.Contents);
    return response.Contents;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { listBucketObjects };

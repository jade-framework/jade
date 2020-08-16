const { asyncListBucketObjects } = require('../awsAsyncFunctions');
const { jadeErr } = require('../../util/logger');

const listBucketObjects = async (bucketName) => {
  try {
    const response = await asyncListBucketObjects({ Bucket: bucketName });
    return response.Contents;
  } catch (error) {
    jadeErr(error);
  }
};

module.exports = { listBucketObjects };

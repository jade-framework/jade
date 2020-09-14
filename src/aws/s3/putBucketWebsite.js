const { asyncPutBucketWebsite } = require('../awsAsyncFunctions');

const putBucketWebsite = async (bucketName) => {
  await asyncPutBucketWebsite({
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'error.html',
      },
      IndexDocument: {
        Suffix: 'index.html',
      },
    },
  });
};

module.exports = { putBucketWebsite };

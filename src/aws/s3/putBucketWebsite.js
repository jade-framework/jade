const { asyncPutBucketWebsite } = require('../awsAsyncFunctions');

const putBucketWebsite = async (bucketName) => {
  await asyncPutBucketWebsite({
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'error.html',
      },
      IndexDocument: {
        Suffix: '404.html',
      },
    },
  });
};

module.exports = { putBucketWebsite };

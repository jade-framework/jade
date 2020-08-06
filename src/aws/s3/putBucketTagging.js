const { asyncPutBucketTagging } = require('../awsAsyncFunctions');

const putBucketTagging = async (bucketName, tags) => {
  await asyncPutBucketTagging({
    Bucket: bucketName,
    Tagging: {
      TagSet: tags,
    },
  });
};

module.exports = { putBucketTagging };

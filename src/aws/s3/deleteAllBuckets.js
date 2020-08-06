const { deleteBucket } = require('./deleteBucket');
const {
  asyncListBuckets,
  asyncGetBucketTagging,
} = require('../awsAsyncFunctions');

const deleteAllBuckets = async () => {
  console.log('Deleting ALL Buckets...');

  try {
    const allBuckets = await asyncListBuckets();
    allBuckets.Buckets.forEach(async (bucket) => {
      try {
        const tags = await asyncGetBucketTagging({ Bucket: bucket.Name });

        if (tags && tags.TagSet[0].Value === 'jade') {
          deleteBucket(bucket.Name);
        }
      } catch (error) {
        console.log(
          `Bucket ${bucket.Name} not tagged with jade project. Moving on...`,
        );
      }
    });
  } catch (error) {
    console.log('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteAllBuckets };

const { deleteBucket } = require('./deleteBucket');
const { asyncListBuckets } = require('../awsAsyncFunctions');

const deleteAllBuckets = async () => {
  console.log('Deleting ALL Bucket...');

  try {
    const allBuckets = await asyncListBuckets();

    allBuckets.Buckets.forEach(bucket => {
      deleteBucket(bucket.Name);
    });
  } catch (error) {
    console.log('Error deleting S3 Bucket', error);
  }
};

module.exports = { deleteAllBuckets };

deleteAllBuckets();

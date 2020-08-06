const {
  asyncCreateS3Bucket,
  asyncPutBucketTagging,
} = require('../awsAsyncFunctions');

const createBucket = async (bucketName) => {
  console.log('Creating S3 Bucket...');

  try {
    const response1 = await asyncCreateS3Bucket({ Bucket: bucketName });
    console.log(`S3 Bucket created at ${response1.Location}`);
    const response2 = await asyncPutBucketTagging({
      Bucket: bucketName,
      Tagging: { TagSet: [{ Key: 'project', Value: 'jade' }] },
    });
    console.log(`Jade project tag added to bucket.`);
  } catch (error) {
    console.log('Error creating S3 Bucket', error);
  }
};

module.exports = { createBucket };

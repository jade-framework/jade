const uuid = require('uuid');
const { createBucket } = require('../aws/s3/createBucket');
const { updateBucketPolicy } = require('../aws/s3/updateBucketPolicy');
const {
  createCloudfrontDistribution,
} = require('../aws/cloudfront/createCloudfrontDistribution');
const {
  updateCloudfrontDistribution,
} = require('../aws/cloudfront/updateCloudfrontDistribution');

// const createBuckets = async bucketName => {
//   await createBucket(`${bucketName}`);
//   updateBucketPolicy(`${bucketName}`);
// };
// createBuckets(`test-${uuid.v4()}`);
// createCloudfrontDistribution(
//   'test-0a9394f7-6e3c-4442-84f5-1fb91f81c18d',
//   '/2020-08-04-v1'
// );
updateCloudfrontDistribution('E1K4R3R9VUVT11', '2020-08-04-v3');

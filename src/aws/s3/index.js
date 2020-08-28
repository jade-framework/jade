const { createBucket } = require('./createBucket');
const { createBuckets } = require('./createBuckets');
const {
  setBucketNotificationConfig,
} = require('./setBucketNotificationConfig');
const { updateBucketPolicy } = require('./updateBucketPolicy');
const { uploadToBucket } = require('./uploadToBucket');
const { putBucketWebsite } = require('./putBucketWebsite');

module.exports = {
  createBucket,
  createBuckets,
  putBucketWebsite,
  setBucketNotificationConfig,
  updateBucketPolicy,
  uploadToBucket,
};

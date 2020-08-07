// const { promisify } = require('util');
// const CloudFront = require('aws-sdk/clients/cloudfront');

// const cloudFront = new CloudFront({ apiVersion: '2019-03-26' });

// const asyncCreateCloudFrontDistribution = promisify(
//   cloudFront.createDistribution.bind(cloudFront)
// );

// module.exports = { asyncCreateCloudFrontDistribution };

const {
  createCloudFrontDistribution,
} = require('./createCloudFrontDistribution');
const { getCloudFrontDistribution } = require('./getCloudFrontDistribution');

module.exports = { createCloudFrontDistribution, getCloudFrontDistribution };

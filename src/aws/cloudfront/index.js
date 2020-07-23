const { promisify } = require('util');
const CloudFront = require('aws-sdk/clients/cloudfront');

const cloudfront = new CloudFront({ apiVersion: '2019-03-26' });

const asyncCreateCloudfrontDistribution = promisify(
  cloudfront.createDistribution.bind(cloudfront)
);

module.exports = { asyncCreateCloudfrontDistribution };

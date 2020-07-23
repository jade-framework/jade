const { promisify } = require('util');
const AWS = require('aws-sdk/global');
const Lambda = require('aws-sdk/clients/lambda');

AWS.config.update({ region: 'us-east-1' });
const lambda = new Lambda();

const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));

module.exports = {
  asyncAddPermission,
};

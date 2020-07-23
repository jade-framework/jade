// @TODO: Move IAM out of here

const { promisify } = require('util');
const AWS = require('aws-sdk/global');
const Lambda = require('aws-sdk/clients/lambda');
const awsIAM = require('aws-sdk/clients/iam');

AWS.config.update({ region: 'us-east-1' });
const lambda = new Lambda();
const iam = new awsIAM({ apiVersion: '2010-05-08' });

const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncCreateLambdaFunction = promisify(lambda.createFunction.bind(lambda));
const asyncCreateLambdaRole = promisify(iam.attachRolePolicy.bind(iam));
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));

module.exports = {
  asyncAddPermission,
  asyncCreateLambdaFunction,
  asyncCreateLambdaRole,
  asyncAttachRolePolicy,
};

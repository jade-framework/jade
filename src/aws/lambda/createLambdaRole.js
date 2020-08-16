const {
  asyncCreateRole,
  asyncAttachRolePolicy,
} = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const createLambdaRole = async (roleName) => {
  jadeLog('Creating Lambda role...');

  const myPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  };

  const createParams = {
    AssumeRolePolicyDocument: JSON.stringify(myPolicy),
    RoleName: roleName,
  };

  const lambdaPolicyParam1 = {
    PolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
    RoleName: roleName,
  };

  const lambdaPolicyParam2 = {
    PolicyArn: 'arn:aws:iam::aws:policy/CloudFrontFullAccess',
    RoleName: roleName,
  };

  try {
    const createResponse = await asyncCreateRole(createParams);
    jadeLog('Successfully created Lambda role.');

    await asyncAttachRolePolicy(lambdaPolicyParam1);
    jadeLog('Successfully attached Lambda policy.');
    await asyncAttachRolePolicy(lambdaPolicyParam2);
    jadeLog('Successfully attached CloudFront policy.');
    return createResponse;
  } catch (error) {
    jadeErr('Could not create role.', error);
  }
};

exports.createLambdaRole = createLambdaRole;

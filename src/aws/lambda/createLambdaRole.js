const {
  asyncCreateRole,
  asyncAttachRolePolicy,
} = require('../awsAsyncFunctions');

const createLambdaRole = async (roleName) => {
  console.log('Creating Lambda role...');

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
    PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole',
    RoleName: roleName,
  };

  const lambdaPolicyParam2 = {
    PolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaExecute',
    RoleName: roleName,
  };

  const lambdaPolicyParam3 = {
    PolicyArn: 'arn:aws:iam::aws:policy/CloudFrontFullAccess',
    RoleName: roleName,
  };

  try {
    const createResponse = await asyncCreateRole(createParams);
    console.log('Successfully created Lambda role.');

    await asyncAttachRolePolicy(lambdaPolicyParam1);
    console.log('Successfully attached Lambda Role policy.');
    await asyncAttachRolePolicy(lambdaPolicyParam2);
    console.log('Successfully attached Lambda Execute policy.');
    await asyncAttachRolePolicy(lambdaPolicyParam3);
    console.log('Successfully attached CloudFront policy.');
    return createResponse;
  } catch (error) {
    console.log('Could not create role.', error);
  }
};

exports.createLambdaRole = createLambdaRole;

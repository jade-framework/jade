const {
  asyncCreateLambdaRole,
  asyncAttachRolePolicy,
} = require('../awsAsyncFunctions');

const createLambdaRole = async () => {
  console.log('Creating Lambda role...');

  const ROLE = 'ROLE_LAMBDA';
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
    RoleName: ROLE,
  };

  const lambdaPolicyParams = {
    PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole',
    RoleName: ROLE,
  };

  try {
    const createResponse = await asyncCreateLambdaRole(createParams);
    console.log('Successfully created Lambda role.', createResponse);

    const attachResponse = await asyncAttachRolePolicy(lambdaPolicyParams);
    console.log('Successfully attached policy.', attachResponse);
  } catch (error) {
    console.log('Could not create role.', error);
  }
};

exports.createLambdaRole = createLambdaRole;

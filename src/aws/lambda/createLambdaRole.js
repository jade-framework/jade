const {
  asyncCreateLambdaRole,
  attachRolePolicy,
  asyncAttachRolePolicy,
} = require('./index');

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

  // iam.createRole(createParams, function (err, data) {
  //   if (err) {
  //     console.log(err, err.stack);
  //   } else {
  //     console.log('Role ARN is', data.Role.Arn);
  //     iam.attachRolePolicy(lambdaPolicyParams, function (err, data) {
  //       if (err) {
  //         console.log(err, err.stack);
  //       } else {
  //         console.log('AWSLambdaRole policy attached');
  //       }
  //     });
  //   }
  // });
};

exports.createLambdaRole = createLambdaRole;

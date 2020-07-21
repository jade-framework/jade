const AWS = require('aws-sdk/global');
const awsLambda = require('aws-sdk/clients/lambda');
const awsIAM = require('aws-sdk/clients/iam');

const createLambdaRole = () => {
  console.log('Creating Lambda role...');
  const iam = new awsIAM({ apiVersion: '2010-05-08' });
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

  iam.createRole(createParams, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log('Role ARN is', data.Role.Arn);
      iam.attachRolePolicy(lambdaPolicyParams, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log('AWSLambdaRole policy attached');
        }
      });
    }
  });
};

const createLambda = (
  bucketName,
  zipFileName,
  functionName,
  handler,
  description = 'Sample description'
) => {
  AWS.config.update({ region: 'us-east-1' });

  const lambda = new awsLambda({ apiVersion: '2015-03-31' });

  const params = {
    Code: {
      S3Bucket: bucketName,
      S3Key: zipFileName,
    },
    FunctionName: functionName,
    Handler: handler,
    Role: 'arn:aws:iam::434812305662:role/ROLE_LAMBDA',
    Runtime: 'nodejs12.x',
    Description: description,
  };

  console.log(params);

  lambda.createFunction(params, function (err, data) {
    if (err) console.log(err);
    else console.log(data);
  });
};

module.exports = {
  createLambdaRole,
  createLambda,
};

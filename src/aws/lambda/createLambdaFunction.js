// const AWS = require('aws-sdk/global');
// const awsLambda = require('aws-sdk/clients/lambda');

const { asyncCreateLambdaFunction } = require('./index');

const createLambdaFunction = async (
  bucketName,
  zipFileName,
  functionName,
  handler,
  description = 'Sample description',
  role = 'arn:aws:iam::434812305662:role/lambda-s3-role'
) => {
  // AWS.config.update({ region: 'us-east-1' });

  // const lambda = new awsLambda({ apiVersion: '2015-03-31' });

  const params = {
    Code: {
      S3Bucket: bucketName,
      S3Key: zipFileName,
    },
    FunctionName: functionName,
    Handler: handler,
    Role: role,
    Runtime: 'nodejs12.x',
    Description: description,
  };

  try {
    const response = await asyncCreateLambdaFunction(params);
    console.log('Successfully created lambda function.', response);
    return response;
  } catch (error) {
    console.log('Error creating lambda function', error);
  }

  // lambda.createFunction(params, function (err, data) {
  //   if (err) console.log(err);
  //   else console.log(data);
  // });
};

module.exports = { createLambdaFunction };

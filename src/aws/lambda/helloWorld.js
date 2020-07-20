/**
 * An AWS Lambda function that logs and returns a message
 */

const awsLambda = require('aws-sdk/clients/lambda');

exports.myHandler = async (event, context, callback) => {
  console.log('Hello from Lambda!');
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

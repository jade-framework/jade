const { asyncCreateLambdaFunction } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const createLambdaFunction = async (
  bucketName,
  zipFileName,
  functionName,
  handler,
  description = 'Sample description',
  role,
) => {
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
    jadeLog('Successfully created Lambda function.');
    return response;
  } catch (error) {
    jadeErr('Error creating Lambda function', error);
  }
};

module.exports = { createLambdaFunction };

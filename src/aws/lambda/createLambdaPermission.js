const { asyncAddPermission } = require('../awsAsyncFunctions');

const createLambdaPermission = async lambdaArn => {
  const params = {
    Action: 'lambda:InvokeFunction',
    FunctionName: lambdaArn,
    Principal: 's3.amazonaws.com',
    SourceAccount: '434812305662',
    StatementId: `example-S3-permission`,
  };

  try {
    const response = await asyncAddPermission(params);
    console.log('Successfully added lambda permission.', response);
  } catch (error) {
    console.log('Error adding lambda permission.', error, error.stack);
  }
};

module.exports = { createLambdaPermission };

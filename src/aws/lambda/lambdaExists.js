const { asyncGetFunction } = require('../awsAsyncFunctions');

const lambdaExists = async (functionName) => {
  try {
    return await asyncGetFunction({ FunctionName: functionName });
  } catch (error) {
    return false;
  }
};

module.exports = { lambdaExists };

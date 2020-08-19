const { asyncDeleteLambdaFunction } = require('../awsAsyncFunctions');
const { jadeErr, jadeLog } = require('../../util/logger');

const deleteLambdaFunction = async (functionName) => {
  try {
    jadeLog(`Deleting lambda function ${functionName}.`);
    await asyncDeleteLambdaFunction({ FunctionName: functionName });
    jadeLog('Successfully deleted lambda function.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteLambdaFunction };

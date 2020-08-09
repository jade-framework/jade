const { asyncDeleteLambdaFunction } = require('../awsAsyncFunctions');

const deleteLambdaFunction = async (functionName) => {
  try {
    console.log(`Deleting lambda function ${functionName}`);
    await asyncDeleteLambdaFunction({ FunctionName: functionName });
    console.log('Successfully deleted lambda function');
  } catch (error) {
    console.log('Could not delete lambda function: ', error);
  }
};

module.exports = deleteLambdaFunction;

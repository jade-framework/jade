const { asyncAddPermission } = require('../awsAsyncFunctions');

const createLambdaPermission = async (params) => {
  try {
    await asyncAddPermission(params);
    console.log('Successfully added lambda permission.');
  } catch (error) {
    console.log('Error adding lambda permission.', error, error.stack);
  }
};

module.exports = { createLambdaPermission };

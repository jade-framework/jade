const { createLambdaFunction } = require('./createLambdaFunction');
const { createLambdaPermission } = require('./createLambdaPermission');
const { createLambdaRole } = require('./createLambdaRole');
const { lambdaExists } = require('./lambdaExists');

module.exports = {
  createLambdaFunction,
  createLambdaPermission,
  createLambdaRole,
  lambdaExists,
};

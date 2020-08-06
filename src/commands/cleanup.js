const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const { deleteIamRole } = require('../aws/iam');
const deleteLambdaFunction = require('../aws/lambda/deleteLambdaFunction');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
  lambdaFunctionName,
} = require('../templates/constants');

const cleanup = async () => {
  deleteAllBuckets();
  deleteIamRole(lambdaIamRoleName, lambdaRolePolicies);
  deleteLambdaFunction(lambdaFunctionName);
};

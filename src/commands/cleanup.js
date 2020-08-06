const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const { deleteIamRole } = require('../aws/iam');
const deleteLambdaFunction = require('../aws/lambda/deleteLambdaFunction');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
  lambdaNames,
} = require('../templates/constants');

const cleanup = async () => {
  deleteAllBuckets();
  await deleteIamRole(lambdaIamRoleName, lambdaRolePolicies);
  deleteLambdaFunction(lambdaNames);
};

module.exports = cleanup;

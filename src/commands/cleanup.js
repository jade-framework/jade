const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const { deleteIamRole } = require('../aws/iam');
const { deleteLambdaFunction } = require('../aws/lambda/deleteLambdaFunction');
const { deleteAllDynamoTables } = require('../aws/dynamo');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
  lambdaNames,
} = require('../templates/constants');

const cleanup = async () => {
  try {
    await deleteAllBuckets();
  } catch (err) {
    console.log(err);
  }
  try {
    await deleteIamRole(lambdaIamRoleName, lambdaRolePolicies);
  } catch (err) {
    console.log(err);
  }
  try {
    await deleteLambdaFunction(lambdaNames);
  } catch (err) {
    console.log(err);
  }
  try {
    await deleteAllDynamoTables();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { cleanup };

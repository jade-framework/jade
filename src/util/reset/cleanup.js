const { deleteAllBuckets } = require('../../aws/s3/deleteAllBuckets');
const { deleteIamRole } = require('../../aws/iam');
const {
  deleteLambdaFunction,
} = require('../../aws/lambda/deleteLambdaFunction');
const { deleteAllDynamoTables } = require('../../aws/dynamo');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
  lambdaNames,
} = require('../../templates/constants');
const { jadeErr } = require('../logger');

const cleanup = async () => {
  try {
    await deleteAllBuckets();
  } catch (err) {
    jadeErr(err);
  }
  try {
    await deleteIamRole(lambdaIamRoleName);
  } catch (err) {
    jadeErr(err);
  }
  try {
    await deleteLambdaFunction(lambdaNames);
  } catch (err) {
    jadeErr(err);
  }
  try {
    await deleteAllDynamoTables();
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { cleanup };

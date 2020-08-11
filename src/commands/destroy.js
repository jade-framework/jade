const { writeConfig, readConfig } = require('../util/fileUtils');
const { jadeErr, jadeWarn, jadeLog } = require('../util/logger');
const { confirmDestroy } = require('../util/questions');
const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const { deleteIamRole } = require('../aws/iam/deleteIamRole');
const { deleteLambdaFunction } = require('../aws/lambda/deleteLambdaFunction');
const {
  lambdaNames,
  lambdaRolePolicies,
  lambdaIamRoleName,
} = require('../templates/constants');

const destroy = async () => {
  try {
    const answer = await confirmDestroy();
    if (!answer) return false;

    //deleteAllBuckets();
    deleteLambdaFunction(lambdaNames);
    //deleteIamRole(lambdaIamRoleName, lambdaRolePolicies);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { destroy };

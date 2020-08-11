const {
  asyncDetachRolePolicy,
  asyncDeleteRole,
} = require('../awsAsyncFunctions');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
} = require('../../templates/constants');
const { jadeErr, jadeLog } = require('../../util/logger');

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async () => {
  try {
    jadeLog('Deleting "jade-lambda-role"...');
    lambdaRolePolicies.forEach(async (policy) => {
      await asyncDetachRolePolicy({
        RoleName: lambdaIamRoleName,
        PolicyArn: policy,
      });
    });

    await asyncDeleteRole({ RoleName: lambdaIamRoleName });
    jadeLog('Role successfully deleted.');
  } catch (error) {
    jadeErr(error);
  }
};

module.exports = { deleteIamRole };

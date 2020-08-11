const {
  asyncDetachRolePolicy,
  asyncDeleteRole,
} = require('../awsAsyncFunctions');
const { jadeErr, jadeLog } = require('../../util/logger');

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async (iamRoleName, iamPolicyArns) => {
  try {
    jadeLog('Deleting "jade-lambda-role"...');
    iamPolicyArns.forEach(async (policy) => {
      await asyncDetachRolePolicy({
        RoleName: iamRoleName,
        PolicyArn: policy,
      });
    });

    await asyncDeleteRole({ RoleName: iamRoleName });
    jadeLog('Role successfully deleted.');
  } catch (error) {
    jadeErr(error);
  }
};

module.exports = { deleteIamRole };

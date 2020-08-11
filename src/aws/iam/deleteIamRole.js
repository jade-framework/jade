const {
  asyncDetachRolePolicy,
  asyncDeleteRole,
} = require('../awsAsyncFunctions');
const {
  lambdaRolePolicies,
  lambdaIamRoleName,
  ec2IamRoleName,
} = require('../../templates/constants');
const { jadeErr, jadeLog } = require('../../util/logger');

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async (iamRoleName, iamPolicyArns) => {
  try {
    iamPolicyArns.forEach(async (policy) => {
      await asyncDetachRolePolicy({ RoleName: iamRoleName, PolicyArn: policy });
    });

    await asyncDeleteRole({ RoleName: iamRoleName });
  } catch (error) {
    console.log(error);
  }
};

const deleteJadeIamRoles = async () => {
  try {
    await deleteIamRole(lambdaIamRoleName, lambdaRolePolicies);
    await deleteIamRole(ec2IamRoleName);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteJadeIamRoles };

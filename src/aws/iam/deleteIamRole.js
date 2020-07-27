const { asyncDetachRolePolicy, asyncDeleteRole } = require(".");

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async (iamRoleName, iamPolicyArns) => {
  try {
    await iamPolicyArns.forEach(async (policy) => {
      await asyncDetachRolePolicy({ RoleName: iamRoleName, PolicyArn: policy });
    });

    await asyncDeleteRole({ RoleName: iamRoleName });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { deleteIamRole };

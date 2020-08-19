const {
  asyncListAttachedRolePolicies,
  asyncDetachRolePolicy,
  asyncDeleteRole,
} = require('../awsAsyncFunctions');
const { jadeErr, jadeLog } = require('../../util/logger');

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async (iamRoleName) => {
  const params = {
    RoleName: iamRoleName,
  };
  try {
    const policies = await asyncListAttachedRolePolicies(params);
    const promises = policies.AttachedPolicies.map((policy) => {
      return (async () => {
        const { PolicyArn, PolicyName } = policy;
        jadeLog(`Deleting ${PolicyName}...`);
        await asyncDetachRolePolicy({ ...params, PolicyArn });
      })();
    });
    await Promise.all(promises);

    jadeLog(`${iamRoleName} policies detached.`);
    jadeLog(`Deleting ${iamRoleName}...`);

    await asyncDeleteRole({ RoleName: iamRoleName });
    jadeLog(`${iamRoleName} successfully deleted.`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteIamRole };

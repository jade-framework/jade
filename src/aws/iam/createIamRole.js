const {
  asyncCreateRole,
  asyncAttachRolePolicy,
} = require('../awsAsyncFunctions');
const { roleExists } = require('./exists');
const { jadeLog, jadeErr } = require('../../util/logger');

const createIamRole = async (policyDocument, roleName, policies) => {
  try {
    let roleResponse = await roleExists(roleName);
    if (!roleResponse) {
      jadeLog(`Creating new ${roleName} role...`);
      roleResponse = await asyncCreateRole({
        AssumeRolePolicyDocument: JSON.stringify(policyDocument),
        RoleName: roleName,
        Tags: [{ Key: 'project', Value: 'jade' }],
      });

      const promises = policies.map((policy) => {
        return (async () => {
          const name = policy.split('policy/')[1];
          jadeLog(`Attaching ${name} role policy...`);

          await asyncAttachRolePolicy({
            PolicyArn: policy,
            RoleName: roleName,
          });
        })();
      });

      await Promise.all(promises);
      roleResponse = await roleExists(roleName);
      jadeLog(`Successfully created ${roleName} role.`);
    } else {
      jadeLog(`Using existing ${roleName} role.`);
    }
    return roleResponse;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createIamRole };

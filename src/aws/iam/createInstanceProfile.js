const {
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
} = require('../awsAsyncFunctions');
const { instanceProfileExists } = require('./exists');

const { jadeLog, jadeErr } = require('../../util/logger');

const validateRoleAdded = async (instanceProfileRes) => {
  return instanceProfileRes.InstanceProfile.Roles.length > 0;
};

const createInstanceProfile = async (profileName, roleName) => {
  try {
    let instanceProfileResponse = await instanceProfileExists(profileName);
    if (!instanceProfileResponse) {
      jadeLog(`Creating instance profile ${profileName}...`);
      instanceProfileResponse = await asyncCreateInstanceProfile({
        InstanceProfileName: profileName,
      });
    } else {
      jadeLog(`Using existing Jade instance profile ${profileName}.`);
    }
    const roleAdded = await validateRoleAdded(instanceProfileResponse);
    if (!roleAdded) {
      jadeLog(`Adding role ${roleName} to instance profile ${profileName}...`);
      await asyncAddRoleToProfile({
        InstanceProfileName: profileName,
        RoleName: roleName,
      });
      instanceProfileResponse = await instanceProfileExists(profileName);
    }
    return instanceProfileResponse;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createInstanceProfile };

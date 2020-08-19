const {
  asyncRemoveRoleFromInstanceProfile,
  asyncDeleteInstanceProfile,
} = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const deleteInstanceProfile = async (instanceProfile, role) => {
  try {
    jadeLog(
      `Removing role ${role} from instance profile ${instanceProfile}...`,
    );
    await asyncRemoveRoleFromInstanceProfile({
      InstanceProfileName: instanceProfile,
      RoleName: role,
    });
    jadeLog(`Deleting instance profile...`);
    await asyncDeleteInstanceProfile({
      InstanceProfileName: instanceProfile,
    });
    jadeLog(`${instanceProfile} deleted.`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteInstanceProfile };

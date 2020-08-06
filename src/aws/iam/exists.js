const {
  asyncGetRole,
  asyncGetInstanceProfile,
} = require('../awsAsyncFunctions');

const roleExists = async (roleName) => {
  try {
    return await asyncGetRole({
      RoleName: roleName,
    });
  } catch (err) {
    return false;
  }
};

const instanceProfileExists = async (name) => {
  try {
    return await asyncGetInstanceProfile({
      InstanceProfileName: name,
    });
  } catch (err) {
    return false;
  }
};

module.exports = { roleExists, instanceProfileExists };

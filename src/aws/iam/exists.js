const {
  asyncGetRole,
  asyncGetInstanceProfile,
  asyncGetGroup,
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

const groupExists = async (groupName) => {
  try {
    return await asyncGetGroup({
      GroupName: groupName,
    });
  } catch (err) {
    return false;
  }
};

module.exports = { roleExists, instanceProfileExists, groupExists };

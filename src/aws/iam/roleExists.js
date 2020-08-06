const { asyncGetRole } = require('../awsAsyncFunctions');

const roleExists = async (roleName) => {
  try {
    return await asyncGetRole({
      RoleName: roleName,
    });
  } catch (err) {
    return false;
  }
};

module.exports = { roleExists };

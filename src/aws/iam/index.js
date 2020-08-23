const { configEc2IamRole } = require('./configEc2IamRole');
const { deleteIamRole } = require('./deleteIamRole');
const { roleExists, instanceProfileExists, groupExists } = require('./exists');
const { createIamRole } = require('./createIamRole');
const { createInstanceProfile } = require('./createInstanceProfile');
const { createJadeIamGroup, addUserToJadeGroup } = require('./createIamGroup');
const { deleteIamGroup, deleteJadeIamGroup } = require('./deleteIamGroup');
const { deleteInstanceProfile } = require('./deleteInstanceProfile');

module.exports = {
  createJadeIamGroup,
  deleteJadeIamGroup,
  addUserToJadeGroup,
  configEc2IamRole,
  roleExists,
  createIamRole,
  deleteIamRole,
  instanceProfileExists,
  createInstanceProfile,
  deleteInstanceProfile,
  groupExists,
  deleteIamGroup,
};

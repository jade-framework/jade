const { configEc2IamRole } = require('./configEc2IamRole');
const { deleteIamRole } = require('./deleteIamRole');
const { roleExists, instanceProfileExists, groupExists } = require('./exists');
const { createJadeIamGroup, addUserToJadeGroup } = require('./createIamGroup');
const { deleteIamGroup, deleteJadeIamGroup } = require('./deleteIamGroup');
const { deleteInstanceProfile } = require('./deleteInstanceProfile');

module.exports = {
  configEc2IamRole,
  deleteIamRole,
  roleExists,
  instanceProfileExists,
  groupExists,
  createJadeIamGroup,
  addUserToJadeGroup,
  deleteIamGroup,
  deleteJadeIamGroup,
  deleteInstanceProfile,
};

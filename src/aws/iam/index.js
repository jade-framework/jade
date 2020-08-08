const { configEc2IamRole } = require('./configEc2IamRole');
const { deleteIamRole } = require('./deleteIamRole');
const { roleExists, instanceProfileExists, groupExists } = require('./exists');
const { createJadeIamGroup } = require('./createIamGroup');
const { addUserToJadeGroup } = require('./addUserToJadeGroup');
const { deleteIamGroup, deleteJadeIamGroup } = require('./deleteIamGroup');

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
};

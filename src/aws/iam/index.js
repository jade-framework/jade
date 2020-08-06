const { configEc2IamRole } = require('./configEc2IamRole');
const { deleteIamRole } = require('./deleteIamRole');
const { roleExists, instanceProfileExists } = require('./exists');

module.exports = {
  configEc2IamRole,
  deleteIamRole,
  roleExists,
  instanceProfileExists,
};

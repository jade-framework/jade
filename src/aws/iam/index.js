const { configEc2IamRole } = require('./configEc2IamRole');
const { deleteIamRole } = require('./deleteIamRole');
const { roleExists } = require('./roleExists');

module.exports = {
  configEc2IamRole,
  deleteIamRole,
  roleExists,
};

const { createIamRole } = require('./createIamRole');
const { createInstanceProfile } = require('./createInstanceProfile');

const { jadeLog, jadeErr } = require('../../util/logger');

const {
  ec2IamRoleName,
  ec2InstanceProfile,
  ec2RolePolicies,
} = require('../../templates/constants');

const { join, readJSONFile } = require('../../util/fileUtils');

const configEc2IamRole = async (projectData) => {
  try {
    const ec2DocumentPolicy = await readJSONFile(
      'ec2IamConfig',
      join(__dirname, '..', '..', 'templates'),
    );
    await createIamRole(ec2DocumentPolicy, ec2IamRoleName, ec2RolePolicies);
    const ec2InstanceProfileResponse = await createInstanceProfile(
      ec2InstanceProfile,
      ec2IamRoleName,
    );
    projectData.instanceProfile = ec2InstanceProfileResponse.InstanceProfile;

    jadeLog('EC2 role and instance profile created.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { configEc2IamRole };

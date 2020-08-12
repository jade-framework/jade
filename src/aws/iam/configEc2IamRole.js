const {
  asyncCreateRole,
  asyncAttachRolePolicy,
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
} = require('../awsAsyncFunctions');

const { roleExists, instanceProfileExists } = require('./exists');

const {
  ec2IamRoleName,
  ec2InstanceProfile,
  cwd,
  s3FullAccessPolicyArn,
  dynamoDbFullAccessPolicyArn,
} = require('../../templates/constants');

const { join, getJadePath, readJSONFile } = require('../../util/fileUtils');

const path = require('path');

const validateRoleAdded = async (instanceProfileRes) => {
  return instanceProfileRes.InstanceProfile.Roles.length > 0;
};

const configEc2IamRole = async (projectData) => {
  try {
    let ec2RoleResponse = await roleExists(ec2IamRoleName);
    if (!ec2RoleResponse) {
      const rolePolicy = await readJSONFile(
        'ec2IamConfig',
        join(path.resolve(path.dirname('.')), 'src', 'templates'),
      );

      console.log('Creating new role...');
      ec2RoleResponse = await asyncCreateRole({
        AssumeRolePolicyDocument: JSON.stringify(rolePolicy),
        RoleName: ec2IamRoleName,
        Tags: [{ Key: 'project', Value: 'jade' }],
      });

      console.log('Attaching S3 role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: s3FullAccessPolicyArn,
        RoleName: ec2IamRoleName,
      });

      console.log('Attaching DynamoDB role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: dynamoDbFullAccessPolicyArn,
        RoleName: ec2IamRoleName,
      });
      ec2RoleResponse = await roleExists(ec2IamRoleName);
    } else {
      console.log('Using existing Jade EC2 role.');
    }

    let instanceProfileResponse = await instanceProfileExists(
      ec2InstanceProfile,
    );

    if (!instanceProfileResponse) {
      console.log('Creating instance profile...');
      instanceProfileResponse = await asyncCreateInstanceProfile({
        InstanceProfileName: ec2InstanceProfile,
      });
    } else {
      console.log('Using existing Jade instance profile.');
    }

    const roleAdded = await validateRoleAdded(instanceProfileResponse);
    if (!roleAdded) {
      console.log('Adding role to instance profile...');
      await asyncAddRoleToProfile({
        InstanceProfileName: ec2InstanceProfile,
        RoleName: ec2IamRoleName,
      });
      instanceProfileResponse = await instanceProfileExists(ec2InstanceProfile);
    }
    projectData.instanceProfile = instanceProfileResponse.InstanceProfile;
    console.log('Jade instance profile for EC2 created.');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { configEc2IamRole };

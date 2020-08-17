const {
  asyncCreateRole,
  asyncAttachRolePolicy,
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
} = require('../awsAsyncFunctions');

const { jadeLog, jadeErr } = require('../../util/logger');
const { roleExists, instanceProfileExists } = require('./exists');

const {
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
  dynamoDbFullAccessPolicyArn,
  cloudFrontFullAccess,
  ec2FullAccess,
} = require('../../templates/constants');

const { join, readJSONFile } = require('../../util/fileUtils');

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

      jadeLog('Creating new role...');
      ec2RoleResponse = await asyncCreateRole({
        AssumeRolePolicyDocument: JSON.stringify(rolePolicy),
        RoleName: ec2IamRoleName,
        Tags: [{ Key: 'project', Value: 'jade' }],
      });

      jadeLog('Attaching S3 role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: s3FullAccessPolicyArn,
        RoleName: ec2IamRoleName,
      });

      jadeLog('Attaching DynamoDB role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: dynamoDbFullAccessPolicyArn,
        RoleName: ec2IamRoleName,
      });

      jadeLog('Attaching CloudFront role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: cloudFrontFullAccess,
        RoleName: ec2IamRoleName,
      });

      jadeLog('Attaching EC2 role policy...');
      await asyncAttachRolePolicy({
        PolicyArn: ec2FullAccess,
        RoleName: ec2IamRoleName,
      });
      ec2RoleResponse = await roleExists(ec2IamRoleName);
    } else {
      jadeLog('Using existing Jade EC2 role.');
    }

    let instanceProfileResponse = await instanceProfileExists(
      ec2InstanceProfile,
    );

    if (!instanceProfileResponse) {
      jadeLog('Creating instance profile...');
      instanceProfileResponse = await asyncCreateInstanceProfile({
        InstanceProfileName: ec2InstanceProfile,
      });
    } else {
      jadeLog('Using existing Jade instance profile.');
    }

    const roleAdded = await validateRoleAdded(instanceProfileResponse);
    if (!roleAdded) {
      jadeLog('Adding role to instance profile...');
      await asyncAddRoleToProfile({
        InstanceProfileName: ec2InstanceProfile,
        RoleName: ec2IamRoleName,
      });
      instanceProfileResponse = await instanceProfileExists(ec2InstanceProfile);
    }
    projectData.instanceProfile = instanceProfileResponse.InstanceProfile;
    jadeLog('Jade instance profile for EC2 created.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { configEc2IamRole };

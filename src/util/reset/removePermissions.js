const {
  securityGroupName,
  jadeKeyPair,
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
  dynamoDbFullAccessPolicyArn,
  cloudFrontFullAccess,
  ec2FullAccess,
} = require('../../templates/constants');
const { deleteIamRole, deleteInstanceProfile } = require('../../aws/iam');
const {
  asyncDeleteSecurityGroup,
  asyncDeleteKeyPair,
} = require('../../aws/awsAsyncFunctions');
const { sleep } = require('../fileUtils');
const { jadeLog, jadeErr } = require('../logger');

// delete security group is no longer used because EC2 instances have to wait for CFDs to be disabled
// once EC2s are ready to delete CFD, they will self-terminate
// the user will have to delete Jade security groups and user groups manually
const deleteSecurityGroup = async (
  securityGroupName,
  maxRetries = 20,
  attempts = 1,
) => {
  if (attempts > maxRetries) {
    jadeLog(
      'Please run this command in a few minutes as AWS is taking too long to remove the Jade security group.',
    );
    return;
  }
  try {
    const res = await asyncDeleteSecurityGroup({
      GroupName: securityGroupName,
    });

    jadeLog(res);
  } catch (err) {
    if (/DependencyViolation/.test(err.code)) {
      jadeLog(
        `Waiting for Jade security group to be detached (retry ${attempts}/${maxRetries})...`,
      );
      await sleep(10000);
      await deleteSecurityGroup(securityGroupName, maxRetries, attempts + 1);
    } else {
      jadeErr(err);
    }
  }
};

async function removePermissions() {
  await deleteInstanceProfile(ec2InstanceProfile, ec2IamRoleName);

  await deleteIamRole(ec2IamRoleName);

  try {
    await asyncDeleteKeyPair({ KeyName: jadeKeyPair });
    jadeLog('Key pair deleted.');
    // await deleteSecurityGroup(securityGroupName);
  } catch (err) {
    jadeErr(err);
  }
}

module.exports = { removePermissions };

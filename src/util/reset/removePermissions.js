const IAM = require('aws-sdk/clients/iam');
const EC2 = require('aws-sdk/clients/ec2');
const { getRegion } = require('../../server/getRegion');
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
const { promisify } = require('util');
const { sleep } = require('../fileUtils');
const { jadeLog, jadeErr } = require('../logger');

const apiVersion = 'latest';
const region = getRegion();

const iam = new IAM({ apiVersion, region });
const ec2 = new EC2({ apiVersion, region });

const deleteSecurityGroup = async (
  securityGroupName,
  maxRetries = 10,
  attempts = 0,
) => {
  try {
    const asyncDeleteSecurityGroup = promisify(
      ec2.deleteSecurityGroup.bind(ec2),
    );
    const res = await asyncDeleteSecurityGroup({
      GroupName: securityGroupName,
    });

    jadeLog(res);
  } catch (err) {
    if (/DependencyViolation/.test(err.code)) {
      jadeLog('Retrying deletion of Jade security group...');
      await sleep(5000);
      await deleteSecurityGroup(securityGroupName, maxRetries, attempts + 1);
    } else {
      jadeErr(err);
    }
  }
};

// TODO: add retries
async function removePermissions() {
  iam.removeRoleFromInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile, RoleName: ec2IamRoleName },
    (err, data) => {
      if (err) jadeErr(err);
      jadeLog(data);
    },
  );

  iam.detachRolePolicy(
    { RoleName: ec2IamRoleName, PolicyArn: s3FullAccessPolicyArn },
    (err, data) => {
      if (err) jadeErr(err);
      iam.detachRolePolicy(
        {
          RoleName: ec2IamRoleName,
          PolicyArn: dynamoDbFullAccessPolicyArn,
        },
        (err, data) => {
          if (err) jadeErr(err);
          iam.detachRolePolicy(
            {
              RoleName: ec2IamRoleName,
              PolicyArn: cloudFrontFullAccess,
            },
            (err, data) => {
              if (err) jadeErr(err);
              iam.detachRolePolicy(
                {
                  RoleName: ec2IamRoleName,
                  PolicyArn: ec2FullAccess,
                },
                (err, data) => {
                  iam.deleteRole({ RoleName: ec2IamRoleName }, (err, data) => {
                    if (err) jadeErr(err);
                    jadeLog(data);
                  });
                },
              );
            },
          );
        },
      );
    },
  );

  iam.deleteInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile },
    (err, data) => {
      if (err) jadeErr(err);
      jadeLog(data);
    },
  );

  ec2.deleteKeyPair({ KeyName: jadeKeyPair }, (err, data) => {
    if (err) jadeErr(err);
    jadeLog(data);
  });

  try {
    await deleteSecurityGroup(securityGroupName);
  } catch (err) {
    jadeErr(err);
  }
}

module.exports = { removePermissions };

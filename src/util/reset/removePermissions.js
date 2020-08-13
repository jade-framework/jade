const IAM = require('aws-sdk/clients/iam');
const EC2 = require('aws-sdk/clients/ec2');
const { getRegion } = require('../getRegion');
const {
  securityGroupName,
  jadeKeyPair,
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
  dynamoDbFullAccessPolicyArn,
} = require('../../templates/constants');
const { promisify } = require('util');

const apiVersion = 'latest';
const region = getRegion();

const iam = new IAM({ apiVersion, region });
const ec2 = new EC2({ apiVersion, region });

const deleteSecurityGroup = async (securityGroupName) => {
  const asyncDeleteSecurityGroup = promisify(ec2.deleteSecurityGroup.bind(ec2));
  const [err, data] = await asyncDeleteSecurityGroup({
    GroupName: securityGroupName,
  });

  console.log(err, data);
};

// TODO: add retries
async function removePermissions() {
  iam.removeRoleFromInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile, RoleName: ec2IamRoleName },
    (err, data) => {
      if (err) console.log(err);
      console.log(data);
    },
  );

  iam.detachRolePolicy(
    { RoleName: ec2IamRoleName, PolicyArn: s3FullAccessPolicyArn },
    (err, data) => {
      if (err) console.log(err);
      iam.detachRolePolicy(
        {
          RoleName: ec2IamRoleName,
          PolicyArn: dynamoDbFullAccessPolicyArn,
        },
        (err, data) => {
          iam.deleteRole({ RoleName: ec2IamRoleName }, (err, data) => {
            if (err) console.log(err);
            console.log(data);
          });
        },
      );
    },
  );

  iam.deleteInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile },
    (err, data) => {
      if (err) console.log(err);
      console.log(data);
    },
  );

  ec2.deleteKeyPair({ KeyName: jadeKeyPair }, (err, data) => {
    if (err) console.log(err);
    console.log(data);
  });

  deleteSecurityGroup(securityGroupName);
}

module.exports = { removePermissions };

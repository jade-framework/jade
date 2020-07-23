const IAM = require("aws-sdk/clients/iam");
const EC2 = require("aws-sdk/clients/ec2");
const { getRegion } = require("../../src/util/getRegion");
const {
  securityGroupName,
  jadeKeyPair,
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
} = require("../../src/constants/allConstants");

const apiVersion = "latest";
const region = getRegion();

const iam = new IAM({ apiVersion, region });
const ec2 = new EC2({ apiVersion, region });

module.exports = function () {
  iam.removeRoleFromInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile, RoleName: ec2IamRoleName },
    (err, data) => {
      if (err) throw err;
      console.log(data);
    }
  );

  iam.detachRolePolicy(
    { RoleName: ec2IamRoleName, PolicyArn: s3FullAccessPolicyArn },
    (err, data) => {
      if (err) throw err;
      iam.deleteRole({ RoleName: ec2IamRoleName }, (err, data) => {
        if (err) throw err;
        console.log(data);
      });
    }
  );

  iam.deleteInstanceProfile(
    { InstanceProfileName: ec2InstanceProfile },
    (err, data) => {
      if (err) throw err;
      console.log(data);
    }
  );

  ec2.deleteKeyPair({ KeyName: jadeKeyPair }, (err, data) => {
    if (err) throw err;
    console.log(data);
  });

  ec2.deleteSecurityGroup({ GroupName: securityGroupName }, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
};

const { promisify } = require('util');
const IAM = require('aws-sdk/clients/iam');
const { getRegion } = require('../../util/getRegion');

const apiVersion = 'latest';
const region = getRegion();

const iam = new IAM({ apiVersion, region });

// promisify IAM functions
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncCreateInstanceProfile = promisify(
  iam.createInstanceProfile.bind(iam)
);
const asyncAddRoleToProfile = promisify(iam.addRoleToInstanceProfile.bind(iam));
const asyncDetachRolePolicy = promisify(iam.detachRolePolicy.bind(iam));
const asyncDeleteRole = promisify(iam.deleteRole.bind(iam));

module.exports = {
  asyncCreateRole,
  asyncAttachRolePolicy,
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
  asyncDetachRolePolicy,
  asyncDeleteRole,
};

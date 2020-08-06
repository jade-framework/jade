const {
  asyncDetachRolePolicy,
  asyncDeleteRole,
} = require('../awsAsyncFunctions');

/**
 * Delete an AWS IAM role
 * @param {string} iamRoleName
 * @param {array} iamPolicyArns
 */
const deleteIamRole = async (iamRoleName, iamPolicyArns) => {
  try {
    await iamPolicyArns.forEach(async (policy) => {
      await asyncDetachRolePolicy({ RoleName: iamRoleName, PolicyArn: policy });
    });

    await asyncDeleteRole({ RoleName: iamRoleName });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { deleteIamRole };
deleteIamRole('lambda-s3-role-2', [
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaExecute',
  'arn:aws:iam::aws:policy/service-role/AWSLambdaRole',
]);

const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const deleteIamRole = require('../aws/iam/deleteIamRole');
const {
  awsLambdaExecutePolicyArn,
  awsLambdaRolePolicyArn,
  lambdaIamRoleName,
} = require('../constants/allConstants');

const cleanup = async bucketName => {
  deleteAllBuckets();
  deleteIamRole(lambdaIamRoleName, [
    awsLambdaRolePolicyArn,
    awsLambdaExecutePolicyArn,
  ]);
};

cleanup();

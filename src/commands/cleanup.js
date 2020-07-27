const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const deleteIamRole = require('../aws/iam/deleteIamRole');
const deleteLambdaFunction = require('../aws/lambda/deleteLambdaFunction');
const {
  awsLambdaExecutePolicyArn,
  awsLambdaRolePolicyArn,
  lambdaIamRoleName,
  lambdaFunctionName,
} = require('../constants/allConstants');

const cleanup = async bucketName => {
  // deleteAllBuckets();
  // deleteIamRole(lambdaIamRoleName, [
  //   awsLambdaRolePolicyArn,
  //   awsLambdaExecutePolicyArn,
  // ]);
  deleteLambdaFunction(lambdaFunctionName);
};

cleanup();

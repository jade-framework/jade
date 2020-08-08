const path = require('path');

const { lambdaIamRoleName, lambdaNames } = require('../../templates/constants');
const { zipit } = require('../../util/zipit');
const { sleep, join } = require('../../util/fileUtils');
const { createLambdaFunction } = require('./createLambdaFunction');
const { createLambdaPermission } = require('./createLambdaPermission');
const { createLambdaRole } = require('./createLambdaRole');
const { lambdaExists } = require('./lambdaExists');
const { uploadToBucket } = require('../s3');
const { roleExists } = require('../iam');
const {
  asyncIamWaitFor,
  asyncGetCallerIdentity,
} = require('../awsAsyncFunctions');

const initJadeLambdas = async (bucketName) => {
  const functionName = lambdaNames;
  const functionFile = `${functionName}.js.zip`;
  const functionHandler = `${functionName}.handler`;
  const functionDescription = `Invalidate index.html in CloudFront on upload to S3.`;

  try {
    await zipit(
      `${functionName}.js`,
      join(
        path.resolve(path.dirname('.')),
        'src',
        'aws',
        'lambda',
        `${functionName}.js`,
      ),
    );
    await uploadToBucket(functionFile, `${bucketName}-lambda`);

    let lambdaRoleResponse = await roleExists(lambdaIamRoleName);
    if (!lambdaRoleResponse) {
      lambdaRoleResponse = await createLambdaRole(lambdaIamRoleName);
      console.log('Waiting for Lambda role to be ready...');
      await asyncIamWaitFor('roleExists', { RoleName: lambdaIamRoleName });
      await sleep(5000);
      console.log('Lambda role ready.');
    }
    let lambdaResponse = await lambdaExists(functionName);
    let lambdaArn;

    if (!lambdaResponse) {
      lambdaResponse = await createLambdaFunction(
        `${bucketName}-lambda`,
        functionFile,
        functionName,
        functionHandler,
        functionDescription,
        lambdaRoleResponse.Role.Arn,
      );
      lambdaArn = lambdaResponse.FunctionArn;
      const { Account } = await asyncGetCallerIdentity();
      const lambdaPermissionParams = {
        Action: 'lambda:InvokeFunction',
        FunctionName: lambdaArn,
        Principal: 's3.amazonaws.com',
        SourceAccount: Account,
        StatementId: `example-S3-permission`,
      };
      await createLambdaPermission(lambdaPermissionParams);
    } else {
      lambdaResponse = lambdaResponse.Configuration;
      lambdaArn = lambdaResponse.FunctionArn;
    }
    return lambdaArn;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { initJadeLambdas };

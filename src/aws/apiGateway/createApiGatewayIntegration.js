const { getRegion } = require("../../util/getRegion");
const { createLambdaPermission } = require("../lambda/createLambdaPermission");

const {
  asyncPutMethod,
  asyncPutIntegration,
  asyncGetCallerIdentity,
} = require("../awsAsyncFunctions");

const createApiGatewayIntegration = async (params) => {
  const {
    httpMethod,
    resourceId,
    restApiId,
    statementId,
    resourceName,
    apiPath,
    path,
  } = params;

  const region = getRegion();
  const accountNumber = (await asyncGetCallerIdentity()).Account;

  const sourceArn = `arn:aws:execute-api:${region}:${accountNumber}:${restApiId}/*/${httpMethod}${apiPath}`;
  const addPermissionParams = {
    FunctionName: resourceName,
    StatementId: statementId,
    Principal: "apigateway.amazonaws.com",
    Action: "lambda:InvokeFunction",
    SourceArn: sourceArn,
  };

  await createLambdaPermission(addPermissionParams);

  const putMethodParams = {
    authorizationType: "NONE",
    httpMethod,
    resourceId,
    restApiId,
  };

  await asyncPutMethod(putMethodParams);

  const putIntegrationParams = {
    httpMethod,
    resourceId,
    restApiId,
    type: "AWS_PROXY",
    integrationHttpMethod: "POST",
    uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${region}:${accountNumber}:function:${resourceName}/invocations`,
  };

  await asyncPutIntegration(putIntegrationParams);
};

module.exports = { createApiGatewayIntegration };

// const uuid = require('uuid');
const { getRegion } = require('../../util/getRegion');

const {
  createApiGatewayIntegration,
} = require('./createApiGatewayIntegration');

const {
  asyncCreateRestApi,
  asyncGetResources,
  asyncCreateDeployment,
} = require('../awsAsyncFunctions');

const { getGithubIp } = require('../../util/getGithubIp');

const deployApiForGitHooks = async (resourceName) => {
  const region = getRegion();
  const jadePath = getJadePath(cwd);
  const stageName = 'webhook';

  try {
    const githubApi = await readJSONFile('githubApi', jadePath);
    const githubApiHooks = githubApi.hooks;
    const resourcePolicyParams = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 'execute-api:Invoke',
          Resource: 'execute-api:/*/*/*',
        },
        {
          Effect: 'Deny',
          Principal: '*',
          Action: 'execute-api:Invoke',
          Resource: 'execute-api:/*/*/*',
          Condition: {
            NotIpAddress: {
              'aws:SourceIp': githubApiHooks,
            },
          },
        },
      ],
    };

    const createApiParams = {
      name: resourceName,
      policy: JSON.stringify(resourcePolicyParams),
    };
    const data = await asyncCreateRestApi(createApiParams);
    const restApiId = data.id;

    const resources = await asyncGetResources({ restApiId });
    const rootResourceId = resources.items[0].id;
    const rootPath = '/';
    // const rootPermissionId = uuid.v4();
    const rootPermissionId = 'abc123';

    const rootIntegrationParams = {
      httpMethod: 'POST',
      restApiId,
      resourceName,
      resourceId: rootResourceId,
      statementId: rootPermissionId,
      apiPath: rootPath,
    };

    await createApiGatewayIntegration(rootIntegrationParams);

    const deploymentParams = {
      restApiId,
      stageName,
    };

    await asyncCreateDeployment(deploymentParams);
    const endpoint = `https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}`;
    return endpoint;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  deployApiForGitHooks,
};

deployApiForGitHooks('hello');

const uuid = require("uuid");
const { getRegion } = require("../../util/getRegion");

const {
  createApiGatewayIntegration,
} = require("./createApiGatewayIntegration");

const {
  asyncCreateRestApi,
  asyncCreateResource,
  asyncGetResources,
} = require("../awsAsyncFunctions");

const deployApi = async (resourceName, path, httpMethods, stageName) => {
  const region = getRegion();

  try {
    const data = await asyncCreateRestApi({ name: resourceName });
    const restApiId = data.id;

    const resources = await asyncGetResources({ restApiId });
    const rootResourceId = resources.items[0].id;

    const createResourceParams = {
      parentId: rootResourceId,
      pathPart: "{proxy+}",
      restApiId,
    };

    // create greedy path resource to allow path params
    const greedyPathResourceId = (
      await asyncCreateResource(createResourceParams)
    ).id;

    const methodPermissionIds = {};
    const rootPath = "/";
    const greedyPath = "/*";

    for (let i = 0; i < httpMethods.length; i += 1) {
      const httpMethod = httpMethods[i];
      const rootPermissionId = uuid.v4();
      const greedyPermissionId = uuid.v4();
      methodPermissionIds[httpMethod] = {
        rootPermissionId,
        greedyPermissionId,
      };

      const rootIntegrationParams = {
        httpMethod,
        restApiId,
        resourceName,
        path,
        resourceId: rootResourceId,
        statementId: rootPermissionId,
        apiPath: rootPath,
      };

      await createApiGatewayIntegration(rootIntegrationParams);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  deployApi,
};

require("dotenv").config();

const { getRegion } = require("./src/util/getRegion");
const { credentials } = require("./src/util/getCredentials");

const {
  asyncCreateRestApi,
  asyncGetResources,
  asyncCreateResource,
  asyncGetCallerIdentity,
} = require("./src/aws/awsAsyncFunctions");

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

    const createdResource = await asyncCreateResource(createResourceParams);
    const greedyPathResourceId = createdResource.id;
    console.log(data);
    console.log(resources);
    console.log(createdResource);
  } catch (err) {
    console.log(err);
  }
};

const init = async () => {
  //await deployApi("krunalpatel");
  let data = (await asyncGetCallerIdentity()).Account;
  console.log(data);
};

init();

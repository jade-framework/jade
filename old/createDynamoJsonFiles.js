const { cwd } = require('../src/templates/constants');
const { createJSONFile, getJadePath } = require('../src/util/fileUtils');
const { jadeErr } = require('../src/util/logger');

const createDynamoJsonFiles = async (projectData) => {
  const versionId = Date.now();
  const jadePath = getJadePath(cwd);
  const { projectName, projectId } = projectData;

  // const appsKey = {
  //   projectName: {
  //     S: projectName
  //   }
  // }

  // const appsExpressionsName = {
  //   '#T': 'versionId'
  // }

  // const appsExpressionsValue = {

  // }

  const key = {
    projectId: {
      S: projectId,
    },
  };

  const expressionNames = {
    '#C': 'commitUrl',
  };

  const expressionValues = {
    ':cu': {
      S: versionId.toString(),
    },
  };

  try {
    await createJSONFile('key', jadePath, key);
    await createJSONFile('expressionNames', jadePath, expressionNames);
    await createJSONFile('expressionValues', jadePath, expressionValues);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = { createDynamoJsonFiles };

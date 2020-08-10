const { deleteBucket } = require('../aws/s3/deleteBucket');
const {
  deleteCloudFrontDistribution,
} = require('../aws/cloudfront/deleteCloudFrontDistribution');
const {
  getCloudFrontDistributionId,
} = require('../aws/cloudfront/getCloudFrontDistributionId');
const {
  disableCloudFrontDistribution,
} = require('../aws/cloudfront/disableCloudFrontDistribution');
const {
  asyncGetCloudFrontDistributionConfig,
} = require('../aws/awsAsyncFunctions');

const { writeConfig, getJadePath, readJSONFile } = require('../util/fileUtils');
const { jadeErr, jadeWarn, jadeLog } = require('../util/logger');

const deleteApp = async (path, appName) => {
  if (!appName) {
    jadeWarn(
      'App name missing. Please re-run the command in the following format: jade delete <appName>',
    );
    return;
  }

  try {
    const jadePath = getJadePath(path);
    const config = await readJSONFile('config', jadePath);

    const targetAppConfig = config.find((app) => {
      return app.projectName === appName;
    });

    if (!targetAppConfig) {
      jadeWarn(
        `Cannot delete ${appName}. App does not exist or was not deployed using Jade`,
      );
      return;
    }

    const { bucketNames, cloudFrontOriginId } = targetAppConfig;
    const CFDId = await getCloudFrontDistributionId(cloudFrontOriginId);
    const cloudFrontConfig = await asyncGetCloudFrontDistributionConfig({
      Id: CFDId,
    });
    const ETag = cloudFrontConfig.ETag;

    for (let i = 0; i < bucketNames.length; i += 1) {
      await deleteBucket(bucketNames[i]);
    }

    await disableCloudFrontDistribution(CFDId, cloudFrontConfig, ETag);
    await deleteCloudFrontDistribution(CFDId, ETag);
    const newConfig = config.filter((app) => {
      return app.projectName !== appName;
    });

    await writeConfig(path, newConfig);
    jadeLog(`"${appName}" has been successully deleted`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteApp };

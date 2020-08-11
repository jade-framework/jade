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
const { validateDeleteArg } = require('../util/validations');

const { writeConfig, readConfig } = require('../util/fileUtils');
const { jadeErr, jadeWarn, jadeLog } = require('../util/logger');

const deleteApp = async (path, appName) => {
  try {
    const config = await readConfig(path);
    let invalidMsg = await validateDeleteArg({ projectName: appName, config });

    if (invalidMsg) {
      jadeWarn(invalidMsg);
      return;
    }

    const targetAppConfig = config.find((app) => {
      return app.projectName === appName;
    });

    const { bucketNames, cloudFrontOriginId } = targetAppConfig;
    const CFDId = await getCloudFrontDistributionId(cloudFrontOriginId);
    const cloudFrontConfig = await asyncGetCloudFrontDistributionConfig({
      Id: CFDId,
    });
    let ETag = cloudFrontConfig.ETag;

    const promises = bucketNames.map((bucketName) => {
      return (async () => {
        await deleteBucket(bucketName);
      })();
    });
    await Promise.all(promises);

    let data = await disableCloudFrontDistribution(
      CFDId,
      cloudFrontConfig,
      ETag,
    );

    ETag = data.ETag;
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

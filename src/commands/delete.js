const { deleteBucket } = require('../aws/s3/deleteBucket');
const {
  deleteCloudFrontDistribution,
} = require('../aws/cloudfront/deleteCloudFrontDistribution');

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
    await Promise.all(
      bucketNames.forEach((bucket) => {
        deleteBucket(bucket);
      }),
    );

    await deleteCloudFrontDistribution(cloudFrontOriginId);
    const newConfig = config.filter((app) => {
      return app.projectName !== appName;
    });

    await writeConfig(path, newConfig);
    jadeLog(`${appName} has been successully deleted`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteApp };

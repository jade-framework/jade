const { deleteBucket } = require('../aws/s3/deleteBucket');
const {
  deleteCloudFrontDistribution,
} = require('../aws/cloudfront/deleteCloudFrontDistribution');
const {
  getCloudFrontDistribution,
} = require('../aws/cloudfront/getCloudFrontDistributionId');

const { writeConfig, getJadePath, readJSONFile } = require('../util/fileUtils');

const deleteApp = async (path, apps) => {
  const jadePath = getJadePath(path);

  for (let i = 0; i < apps.length; i += 1) {
    try {
      let config = await readJSONFile('config', jadePath);
      const appConfig = config.find((app) => {
        app.projectName === appName;
      });
      const bucketName = appConfig.bucketName;
      deleteBucket(bucketName);
      deleteBucket(`${bucketName}-builds`);
      deleteBucket(`${bucketName}-lambda`);

      const cloudFrontId = await getCloudFrontDistribution(bucketName);
      await deleteCloudFrontDistribution(cloudFrontId);

      config = config.filter((app) => {
        return app.projectName !== appName;
      });

      await writeConfig(path, config);
    } catch (err) {
      console.log(err);
    }
    27;
  }
};

module.exports = { deleteApp };

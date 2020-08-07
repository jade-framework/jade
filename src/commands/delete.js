const { deleteBucket } = require('../aws/s3/deleteBucket');
const {
  deleteCloudfrontDistribution,
} = require('../aws/cloudfront/deleteCloudfrontDistribution');
const {
  getCloudfrontDistribution,
} = require('../aws/cloudfront/getCloudfrontDistributionId');

const {
  writeConfig,
  getJadePath,
  readJSONFile,
} = require('../../util/fileUtils');
const deleteCloudfrontDistribution = require('../aws/cloudfront/deleteCloudfrontDistribution');

const deleteApp = async (path, appName) => {
  const jadePath = getJadePath(path);

  try {
    let config = await readJSONFile('config', jadePath);
    const appConfig = config.find((app) => {
      app.projectName === appName;
    });
    const bucketName = appConfig.bucketName;
    deleteBucket(bucketName);
    deleteBucket(`${bucketName}-builds`);
    deleteBucket(`${bucketName}-lambda`);

    const cloudfrontId = await getCloudfrontDistribution(bucketName);
    await deleteCloudfrontDistribution(cloudfrontId);

    config = config.filter((app) => {
      return app.projectName !== appName;
    });

    await writeConfig(path, config);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteApp };

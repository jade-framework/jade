const { deleteBucket } = require('../aws/s3/deleteBucket');

const {
  writeConfig,
  getJadePath,
  readJSONFile,
} = require('../../util/fileUtils');

const deleteApp = async (path, appName) => {
  const jadePath = getJadePath(path);

  try {
    let config = await readJSONFile('config', jadePath);
    const appConfig = config.filter((app) => {
      return app.projectName === appName;
    });
    const bucketName = appConfig.bucketName;
    deleteBucket(bucketName);
    deleteBucket(`${bucketName}-builds`);
    deleteBucket(`${bucketName}-lambda`);

    //await deleteCloudFront(appName);

    config = config.filter((app) => {
      return app.projectName !== appName;
    });

    await writeConfig(path, config);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteApp };

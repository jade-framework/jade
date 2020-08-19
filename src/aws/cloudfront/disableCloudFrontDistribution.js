const {
  asyncUpdateCloudFrontDistribution,
  asyncGetCloudFrontDistributionConfig,
  asyncCloudFrontWaitFor,
} = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const disableCloudFrontDistribution = async (cfdId) => {
  const params = {
    Id: cfdId,
  };
  try {
    jadeLog(
      'Getting CFD config (this may take a while if you recently deployed the app)...',
    );
    await asyncCloudFrontWaitFor('distributionDeployed', params);
    let getData = await asyncGetCloudFrontDistributionConfig(params);
    const { ETag, ...data } = getData;
    data.IfMatch = ETag;
    data.DistributionConfig.Enabled = false;
    data.Id = cfdId;
    jadeLog('Updating CFD...');
    let updateData = await asyncUpdateCloudFrontDistribution(data);
    jadeLog('CFD updated.');
    return updateData;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { disableCloudFrontDistribution };

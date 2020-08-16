const {
  asyncUpdateCloudFrontDistribution,
  asyncGetCloudFrontDistributionConfig,
} = require('../awsAsyncFunctions');
const { jadeErr } = require('../../util/logger');

const disableCloudFrontDistribution = async (id, config, ETag) => {
  config.DistributionConfig.Enabled = false;
  config.Id = id;
  config.IfMatch = ETag;
  delete config['ETag'];

  try {
    let data = await asyncUpdateCloudFrontDistribution(config);
    return data;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { disableCloudFrontDistribution };

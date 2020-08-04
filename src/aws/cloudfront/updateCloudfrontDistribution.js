const uuid = require('uuid');
const {
  asyncUpdateCloudfrontDistribution,
  asyncGetCloudfrontDistributionConfig,
} = require('../awsAsyncFunctions');

const updateCloudfrontDistribution = async (distId, dirName) => {
  const config = await asyncGetCloudfrontDistributionConfig({ Id: distId });
  config.DistributionConfig.Origins.Items[0].OriginPath = `/${dirName}`;
  const params = {
    DistributionConfig: config.DistributionConfig,
    Id: distId,
    IfMatch: config.ETag,
  };
  try {
    const response = await asyncUpdateCloudfrontDistribution(params);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateCloudfrontDistribution,
};

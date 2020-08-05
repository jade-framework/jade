const uuid = require('uuid');
const {
  asyncUpdateCloudfrontDistribution,
  asyncGetCloudfrontDistributionConfig,
  asyncCreateCloudfrontInvalidation,
} = require('../awsAsyncFunctions');

const updateCloudfrontDistribution = async (distId, dirName) => {
  const config = await asyncGetCloudfrontDistributionConfig({ Id: distId });
  config.DistributionConfig.Origins.Items[0].OriginPath = `/${dirName}`;
  const params = {
    DistributionConfig: config.DistributionConfig,
    Id: distId,
    IfMatch: config.ETag,
  };
  const invalidateParams = {
    DistributionId: distId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/index.html'],
      },
    },
  };
  try {
    const updateResponse = await asyncUpdateCloudfrontDistribution(params);
    console.log(updateResponse);
    const invalidateResponse = await asyncCreateCloudfrontInvalidation(
      invalidateParams
    );
    console.log(invalidateResponse);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateCloudfrontDistribution,
};

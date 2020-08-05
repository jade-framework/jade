const {
  asyncUpdateCloudfrontDistribution,
  asyncGetCloudfrontDistributionConfig,
  asyncCreateCloudfrontInvalidation,
  asyncListDistributions,
} = require('../awsAsyncFunctions');

const getCloudfrontDistributionId = async (bucketName) => {
  let id;
  try {
    const list = await asyncListDistributions();
    console.log(list.DistributionList.Items);
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === `S3-${bucketName}`,
    );
    id = targetDistribution.Id;
  } catch (error) {
    console.log(error);
  }
  return id;
};

const updateCloudfrontDistribution = async () => {
  // const config = await asyncGetCloudfrontDistributionConfig({ Id: distId });
  // config.DistributionConfig.Origins.Items[0].OriginPath = `/${dirName}`;
  // const params = {
  //   DistributionConfig: config.DistributionConfig,
  //   Id: distId,
  //   IfMatch: config.ETag,
  // };
  const distId = await getCloudfrontDistributionId(
    'test-398e95ce-925e-4c10-99c3-7d94b837498b',
  );
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
    // const updateResponse = await asyncUpdateCloudfrontDistribution(params);
    // console.log(updateResponse);
    const invalidateResponse = await asyncCreateCloudfrontInvalidation(
      invalidateParams,
    );
    console.log(invalidateResponse);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateCloudfrontDistribution,
};

updateCloudfrontDistribution();

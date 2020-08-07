const {
  asyncUpdateCloudFrontDistribution,
  asyncGetCloudFrontDistributionConfig,
  asyncCreateCloudFrontInvalidation,
  asyncListCloudFrontDistributions,
} = require('../awsAsyncFunctions');

const getCloudFrontDistributionId = async (bucketName) => {
  let id;
  try {
    const list = await asyncListCloudFrontDistributions();
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

const updateCloudFrontDistribution = async () => {
  // const config = await asyncGetCloudFrontDistributionConfig({ Id: distId });
  // config.DistributionConfig.Origins.Items[0].OriginPath = `/${dirName}`;
  // const params = {
  //   DistributionConfig: config.DistributionConfig,
  //   Id: distId,
  //   IfMatch: config.ETag,
  // };
  const distId = await getCloudFrontDistributionId(
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
    // const updateResponse = await asyncUpdateCloudFrontDistribution(params);
    // console.log(updateResponse);
    const invalidateResponse = await asyncCreateCloudFrontInvalidation(
      invalidateParams,
    );
    console.log(invalidateResponse);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateCloudFrontDistribution,
};

// updateCloudFrontDistribution();

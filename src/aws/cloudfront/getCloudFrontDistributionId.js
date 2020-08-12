const { asyncListCloudFrontDistributions } = require('../awsAsyncFunctions');

const getCloudFrontDistributionId = async (originId) => {
  let id;
  try {
    const list = await asyncListCloudFrontDistributions();
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === originId,
    );
    id = targetDistribution.Id;
  } catch (error) {
    console.log(error);
  }
  return id;
};

module.exports = {
  getCloudFrontDistributionId,
};

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

// getCloudFrontDistributionId(
//   'S3-test-398e95ce-925e-4c10-99c3-7d94b837498b',
// ).then((val) => console.log(val));

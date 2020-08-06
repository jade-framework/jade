const { asyncListDistributions } = require('../awsAsyncFunctions');

const getCloudfrontDistributionId = async (bucketName) => {
  let id;
  try {
    const list = await asyncListDistributions();
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === bucketName,
    );
    id = targetDistribution.Id;
  } catch (error) {
    console.log(error);
  }
  return id;
};

module.exports = {
  getCloudfrontDistributionId,
};

// getCloudfrontDistributionId(
//   'S3-test-398e95ce-925e-4c10-99c3-7d94b837498b',
// ).then((val) => console.log(val));

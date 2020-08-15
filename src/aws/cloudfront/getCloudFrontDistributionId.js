const { asyncListCloudFrontDistributions } = require('../awsAsyncFunctions');
const { jadeErr } = require('../../util/logger');

const getCloudFrontDistributionId = async (originId) => {
  let id;
  try {
    const list = await asyncListCloudFrontDistributions();
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === originId,
    );
    id = targetDistribution.Id;
  } catch (error) {
    jadeErr(error);
  }
  return id;
};

module.exports = {
  getCloudFrontDistributionId,
};

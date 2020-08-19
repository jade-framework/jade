const { asyncListCloudFrontDistributions } = require('../awsAsyncFunctions');
const { jadeErr } = require('../../util/logger');

const getCloudFrontDistributionId = async (originId, marker = '') => {
  let id;
  let list;
  const params = { Marker: marker };
  try {
    list = await asyncListCloudFrontDistributions(params);
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === originId,
    );
    id = targetDistribution.Id;
  } catch (error) {
    if (list.DistributionList && list.DistributionList.NextMarker) {
      return await getCloudFrontDistributionId(
        originId,
        list.DistributionList.NextMarker,
      );
    }
    jadeErr(error);
  }
  return id;
};

module.exports = {
  getCloudFrontDistributionId,
};

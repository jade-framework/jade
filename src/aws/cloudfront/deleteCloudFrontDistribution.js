const { asyncDeleteCloudFrontDistribution } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const deleteCloudFrontDistribution = async (id, ETag) => {
  try {
    jadeLog('Deleting CloudFront distribution...');
    await asyncDeleteCloudFrontDistribution({ Id: id, IfMatch: ETag });
    jadeLog(`CloudFront distribution ${id} has been successfully deleted`);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteCloudFrontDistribution };

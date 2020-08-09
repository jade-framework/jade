const { asyncDeleteCloudFrontDistribution } = require('../awsAsyncFunctions');

const deleteCloudFrontDistribution = async (id, ETag) => {
  try {
    console.log('Deleting CloudFront distribution...');
    await asyncDeleteCloudFrontDistribution({ Id: id, IfMatch: ETag });
    console.log(`CloudFront distribution ${id} has been successfully deleted`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteCloudFrontDistribution };

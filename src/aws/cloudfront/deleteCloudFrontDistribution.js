const { asyncDeleteDistribution } = require('../awsAsyncFunctions');

const deleteCloudFrontDistribution = async (id) => {
  try {
    console.log('Deleting CloudFront distribution...');
    await asyncDeleteDistribution(id);
    console.log(`CloudFront distribution ${id} has been successfully deleted`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteCloudFrontDistribution };

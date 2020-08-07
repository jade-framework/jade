const { asyncDeleteDistribution } = require('../awsAsyncFunctions');

const deleteCloudfrontDistribution = async (id) => {
  try {
    console.log('Deleting Cloudfront distribution...');
    await asyncDeleteDistribution(id);
    console.log(`Cloudfront distribution ${id} has been successfully deleted`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteCloudfrontDistribution };

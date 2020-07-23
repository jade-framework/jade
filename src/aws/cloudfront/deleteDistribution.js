const { asyncDeleteDistribution } = require('../awsAsyncFunctions');

const deleteDistribution = async id => {
  console.log('Deleting distribution...');

  try {
    await asyncDeleteDistribution({ Id: id });
    console.log(`Cloudfront distribution ${id} deleted`);
  } catch (error) {
    console.log('Error deleting distribution', error);
  }
};

module.exports = { deleteDistribution };

deleteDistribution('E14O3YKLZMPYIB');

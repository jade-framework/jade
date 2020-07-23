const { asyncCreateS3Bucket } = require('./index');

const createS3Bucket = async bucketName => {
  console.log('Creating S3 Bucket...');

  try {
    const response = await asyncCreateS3Bucket({ Bucket: bucketName });
    console.log(`S3 Bucket created at ${response.Location}`);
  } catch (error) {
    console.log('Error creating S3 Bucket', error);
  }
};

exports.createS3Bucket = createS3Bucket;

createS3Bucket('jc-test-jul-22-2020');

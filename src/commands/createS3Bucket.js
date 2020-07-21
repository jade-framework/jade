const { createS3Bucket } = require('../aws/s3');

createS3Bucket(process.argv[2]);

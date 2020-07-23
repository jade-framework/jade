const { uploadFileToS3Bucket } = require('../aws/s3');

// filename, bucketname
uploadFileToS3Bucket(process.argv[2], process.argv[3]);

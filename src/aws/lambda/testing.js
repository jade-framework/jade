const { zipit } = require('../../util/zipit');
const { createLambda } = require('./index');
const { uploadFileToS3Bucket } = require('../s3');

// await uploadFileToS3Bucket('helloWorld.js.zip', bucketName);
// zipit('copyToBucket.js', 'copyToBucket.js');
// uploadFileToS3Bucket(
//   'copyToBucket.js.zip',
//   'test-b80a4ff0-582b-406d-8b9c-fdd7db0c793b-lambda'
// );
createLambda(
  'test-b80a4ff0-582b-406d-8b9c-fdd7db0c793b-lambda',
  'copyToBucket.js.zip',
  'copyToBucket',
  'copyToBucket.handler',
  'A lambda function that copies from src to dest S3 bucket.'
);

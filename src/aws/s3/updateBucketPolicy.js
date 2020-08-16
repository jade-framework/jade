const { asyncPutBucketPolicy } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const updateBucketPolicy = async (bucketName) => {
  const readOnlyAnonUserPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AddPerm',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: [''],
      },
    ],
  };

  // create selected bucket resource string for bucket policy
  const bucketResource = 'arn:aws:s3:::' + bucketName + '/*';
  readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

  // convert policy JSON into string and assign into params
  const bucketPolicyParams = {
    Bucket: bucketName,
    Policy: JSON.stringify(readOnlyAnonUserPolicy),
  };

  // set the new policy on the selected bucket
  jadeLog(`Setting policy on bucket ${bucketName}...`);
  try {
    await asyncPutBucketPolicy(bucketPolicyParams);
    jadeLog('Successfully set S3 bucket policy.');
  } catch (error) {
    jadeErr('Error setting bucket policy: ', error);
  }
};

module.exports = { updateBucketPolicy };

const { asyncPutBucketPolicy } = require('./index');

const updateS3BucketPolicy = async bucketName => {
  const readOnlyAnonUserPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AddPerm',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
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
  console.log(`Setting policy on bucket ${bucketName}...`);
  try {
    const response = await asyncPutBucketPolicy(bucketPolicyParams);
    console.log('Successfully set S3 bucket policy', response);
  } catch (error) {
    console.log('Error setting bucket policy: ', error);
  }
};

updateS3BucketPolicy('jc-test-jul-22-2020');

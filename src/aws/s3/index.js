const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const path = require('path');

const createS3Bucket = async bucketName => {
  console.log('Creating S3 Bucket...');
  const s3 = new S3({ apiVersion: '2006-03-01' });

  try {
    const response = await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`S3 Bucket created at ${response.Location}`);
  } catch (error) {
    console.log(error);
  }
};

const uploadFileToS3Bucket = async (fileName, bucketName) => {
  const fileStream = fs.createReadStream(fileName);
  const uploadKeyName = path.basename(fileName);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  const uploadParams = {
    Bucket: bucketName,
    Key: uploadKeyName,
    Body: fileStream,
    ContentType: 'text/html',
  };

  console.log(`Uploading file ${uploadKeyName} to bucket...`);
  try {
    const response = await new S3({ apiVersion: '2006-03-01' })
      .putObject(uploadParams)
      .promise();

    console.log(
      `File ${uploadKeyName} successfully uploaded to bucket ${bucketName}; ETag ${response.ETag}`
    );
  } catch (error) {
    console.log('Error uploading file', error);
  }
};

/**
 * UPDATE BUCKET POLICY
 */
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
    await new S3({ apiVersion: '2006-03-01' })
      .putBucketPolicy(bucketPolicyParams)
      .promise();
    console.log('Successfully set S3 bucket policy');
  } catch (error) {
    console.log('Error setting bucket policy: ', error);
  }
};

module.exports = {
  createS3Bucket,
  uploadFileToS3Bucket,
  updateS3BucketPolicy,
};

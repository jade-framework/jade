/**
 * Creates a new S3 bucket, adds a bucket policy to allow public read acces,
 * and sets up a CloudFront distribution connected to the newly created bucket.
 *
 * argv[2]: New bucket name
 * argv[3]: File to upload to new bucket
 */

const AWS = require('aws-sdk');
var uuid = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * INPUTS
 */
const bucketName = process.argv[2];
const file = process.argv[3];
const uploadKeyName = path.basename(file);

/**
 * CREATE NEW BUCKET
 */
const createNewBucket = async () => {
  console.log('Creating S3 Bucket...');
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  try {
    const response = await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`S3 Bucket created at ${response.Location}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * UPLOAD FILE TO BUCKET
 */
const uploadFileToBucket = async () => {
  const fileStream = fs.createReadStream(file);
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
    const response = await new AWS.S3({ apiVersion: '2006-03-01' })
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
const updateBucketPolicy = async () => {
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
    await new AWS.S3({ apiVersion: '2006-03-01' })
      .putBucketPolicy(bucketPolicyParams)
      .promise();
    console.log('Successfully set S3 bucket policy');
  } catch (error) {
    console.log('Error setting bucket policy: ', error);
  }
};

const createCloudfrontDistribution = () => {
  const cloudfront = new AWS.CloudFront({ apiVersion: '2019-03-26' });
  const callerReference = 'jade-' + uuid.v4();
  const originDomainName = `${bucketName}.s3.amazonaws.com`;
  const originId = `S3-${bucketName}`; // unique ID of origin within the distribution

  const distParams = {
    DistributionConfig: {
      CallerReference: callerReference,
      Comment: callerReference,
      DefaultCacheBehavior: {
        ForwardedValues: {
          Cookies: {
            Forward: 'none',
            WhitelistedNames: {
              Quantity: 0,
            },
          },
          QueryString: false,
          Headers: {
            Quantity: 0,
          },
          QueryStringCacheKeys: {
            Quantity: 0,
          },
        },
        MinTTL: 0,
        TargetOriginId: originId,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
        },
        ViewerProtocolPolicy: 'allow-all',
        AllowedMethods: {
          Items: ['GET', 'HEAD'],
          Quantity: 2,
          CachedMethods: {
            Items: ['GET', 'HEAD'],
            Quantity: 2,
          },
        },
        Compress: false,
        DefaultTTL: 86400,
        LambdaFunctionAssociations: {
          Quantity: 0,
        },
        MaxTTL: 31536000,
        SmoothStreaming: false,
      },
      Enabled: true,
      Origins: {
        Items: [
          {
            DomainName: originDomainName,
            Id: originId,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: 'match-viewer',
            },
          },
        ],
        Quantity: 1,
      },
    },
  };

  console.log('Creating Cloudfront distribution...');
  cloudfront.createDistribution(distParams, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log('Successfully created Cloudfront distribution');
  });
};

(async () => {
  await createNewBucket();
  uploadFileToBucket();
  updateBucketPolicy();
  createCloudfrontDistribution();
})();

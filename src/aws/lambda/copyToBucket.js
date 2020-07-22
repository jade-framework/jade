/**
 * An AWS Lambda function that copies a file from src to dest bucket on upload to src
 */
const S3 = require('aws-sdk/clients/s3');
const util = require('util');

// get reference to S3 client
const s3 = new S3();

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 })
  );
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const dstBucket = srcBucket + '-copy';
  const dstKey = 'copy-' + srcKey;

  // Download the file from the S3 source bucket.
  let srcFile;
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };
    srcFile = await s3.getObject(params).promise();
  } catch (error) {
    console.log(error);
    return;
  }

  // Upload the file copy to the destination bucket
  try {
    const destparams = {
      Bucket: dstBucket,
      Key: dstKey,
      // ContentType: 'image',
    };

    const putResult = await s3.putObject(destparams).promise();
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(
    'Successfully copied ' +
      srcBucket +
      '/' +
      srcKey +
      ' and uploaded to ' +
      dstBucket +
      '/' +
      dstKey
  );
};

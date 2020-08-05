/**
 * An AWS Lambda function that invalidates a file in a Cloudfront distribution
 * @TODO: NEED DISTRIBUTION ID
 */
const S3 = require('aws-sdk/clients/s3');
const util = require('util');

// get reference to S3 client
const s3 = new S3();

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  );
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  );

  const invalidateParams = {
    DistributionId: 'E1K4R3R9VUVT11',
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/index.html'],
      },
    },
  };

  try {
    const invalidateResponse = await asyncCreateCloudfrontInvalidation(
      invalidateParams,
    );
    console.log(invalidateResponse);
  } catch (error) {
    console.log(error);
  }
};

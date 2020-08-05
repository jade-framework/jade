/**
 * An AWS Lambda function that invalidates a file in a Cloudfront distribution
 */
const util = require('util');
const { promisify } = require('util');
const Cloudfront = require('aws-sdk/clients/cloudfront');

const cloudfront = new Cloudfront();
const asyncCreateCloudfrontInvalidation = promisify(
  cloudfront.createInvalidation.bind(cloudfront),
);
const asyncListDistributions = promisify(
  cloudfront.listDistributions.bind(cloudfront),
);

const getCloudfrontDistributionId = async (bucketName) => {
  let id;
  try {
    const list = await asyncListDistributions();
    const targetDistribution = list.DistributionList.Items.find(
      (el) => el.DefaultCacheBehavior.TargetOriginId === `S3-${bucketName}`,
    );
    id = targetDistribution.Id;
  } catch (error) {
    console.log(error);
  }
  return id;
};

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  );

  const distId = await getCloudfrontDistributionId(
    event.Records[0].s3.bucket.name,
  );
  console.log('distId', distId);

  const params = {
    DistributionId: distId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/index.html'],
      },
    },
  };

  try {
    const invalidateResponse = await asyncCreateCloudfrontInvalidation(params);
    console.log(invalidateResponse);
  } catch (error) {
    console.log(error);
  }
};

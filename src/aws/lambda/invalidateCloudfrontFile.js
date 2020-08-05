/**
 * An AWS Lambda function that invalidates a file in a Cloudfront distribution
 * @TODO: NEED DISTRIBUTION ID
 */
const util = require('util');
const { promisify } = require('util');
const Cloudfront = require('aws-sdk/clients/cloudfront');

const cloudfront = new Cloudfront();
const asyncCreateCloudfrontInvalidation = promisify(
  cloudfront.createInvalidation.bind(cloudfront),
);

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  );

  const params = {
    DistributionId: 'EL5J0YDK2X0IH',
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

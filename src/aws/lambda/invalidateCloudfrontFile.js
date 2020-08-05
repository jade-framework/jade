/**
 * An AWS Lambda function that invalidates a file in a Cloudfront distribution
 * @TODO: NEED DISTRIBUTION ID
 */
const util = require('util');
const Cloudfront = require('aws-sdk/clients/cloudfront');

const cloudfront = new Cloudfront();

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

  cloudfront.createInvalidation(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

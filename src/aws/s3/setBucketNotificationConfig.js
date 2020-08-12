/**
 * Sets an event notification on an S3 bucket to trigger a Lambda
 * - Note: Lambda permission must be created first with createLambdaPermission.js
 *
 * @param {string} bucketName - The name of the S3 bucket to attach the event
 * @param {String} lambdaArn - The ARN of the lambda to be triggered by the event on the bucket
 */

const {
  asyncPutBucketNotificationConfiguration,
} = require('../awsAsyncFunctions');
const { bucketSuffixes } = require('../../templates/constants');

const setBucketNotificationConfig = async (bucketName, lambdaArn) => {
  const lambdaBucketName = `${bucketName}-${bucketSuffixes[1]}`;
  const params = {
    Bucket: lambdaBucketName,
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Id: 'lambda-trigger', // Any name you want to call the event
          Events: ['s3:ObjectCreated:*'],
          LambdaFunctionArn: lambdaArn,
        },
      ],
    },
  };

  try {
    const response = await asyncPutBucketNotificationConfiguration(params);
    console.log(
      'Successfully set bucket notification configuration.',
      response,
    );
  } catch (error) {
    console.log(
      'Error setting bucket notification configuration',
      error,
      error.stack,
    );
  }
};

module.exports = {
  setBucketNotificationConfig,
};

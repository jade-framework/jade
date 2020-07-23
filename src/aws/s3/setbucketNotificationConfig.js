/**
 * Sets an event notification on an S3 bucket to trigger a Lambda
 * - Note: Lambda permission must be created first with createLambdaPermission.js
 *
 * @param {string} bucketName - The name of the S3 bucket to attach the event
 * @param {String} lambdaArn - The ARN of the lambda to be triggered by the event on the bucket
 */

const { asyncPutBucketNotificationConfiguration } = require('./index');

const setBucketNotificationConfig = async (bucketName, lambdaArn) => {
  const params = {
    Bucket: bucketName,
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
      response
    );
  } catch (error) {
    console.log(
      'Error setting bucket notification configuration',
      error,
      error.stack
    );
  }
};

/**
 * Testing
 */

setBucketNotificationConfig(
  'test-7efd1622-b92f-4771-8b1a-b7fa476491ec',
  'arn:aws:lambda:us-east-1:434812305662:function:copyToBucket'
);

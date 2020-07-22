/**
 * Sets an event notification on an S3 bucket to trigger a Lambda
 * - Note: Lambda permission must be created first
 *
 * @param {string} bucketName - The name of the S3 bucket to attach the event
 * @param {String} lambdaArn - The ARN of the lambda to be triggered by the event on the bucket
 */

const S3 = require('aws-sdk/clients/s3');
const Lambda = require('aws-sdk/clients/lambda');
const AWS = require('aws-sdk/global');

function createLambdaPermission(lambdaArn) {
  AWS.config.update({ region: 'us-east-1' });

  const lambda = new Lambda();

  const params = {
    Action: 'lambda:InvokeFunction',
    FunctionName: lambdaArn,
    Principal: 's3.amazonaws.com',
    SourceAccount: '434812305662',
    StatementId: `example-S3-permission`,
  };

  lambda.addPermission(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

const setBucketNotificationConfig = (bucketName, lambdaArn) => {
  const s3 = new S3({ apiVersion: '2006-03-01' });
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

  s3.putBucketNotificationConfiguration(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

createLambdaPermission(
  'arn:aws:lambda:us-east-1:434812305662:function:copyToBucket'
);

setBucketNotificationConfig(
  'test-7efd1622-b92f-4771-8b1a-b7fa476491ec',
  'arn:aws:lambda:us-east-1:434812305662:function:copyToBucket'
);

// @TODO: Move IAM out of here

const { promisify } = require('util');
const S3 = require('aws-sdk/clients/s3');
const CloudFront = require('aws-sdk/clients/cloudfront');
const AWS = require('aws-sdk/global');
const Lambda = require('aws-sdk/clients/lambda');
const awsIAM = require('aws-sdk/clients/iam');

AWS.config.update({ region: 'us-east-1' });

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2019-03-26' });
const lambda = new Lambda();
const iam = new awsIAM({ apiVersion: '2010-05-08' });

// CLOUDFRONT
const asyncCreateCloudfrontDistribution = promisify(
  cloudfront.createDistribution.bind(cloudfront)
);
const asyncListDistributions = promisify(
  cloudfront.listDistributions.bind(cloudfront)
);
const asyncDeleteDistribution = promisify(
  cloudfront.deleteDistribution.bind(cloudfront)
);

// S3
const asyncListBuckets = promisify(s3.listBuckets.bind(s3));
const asyncListBucketObjects = promisify(s3.listObjects.bind(s3));
const asyncDeleteBucketObjects = promisify(s3.deleteObjects.bind(s3));
const asyncCreateS3Bucket = promisify(s3.createBucket.bind(s3));
const asyncDeleteS3Bucket = promisify(s3.deleteBucket.bind(s3));
const asyncPutBucketPolicy = promisify(s3.putBucketPolicy.bind(s3));
const asyncUploadToBucket = promisify(s3.putObject.bind(s3));
const asyncPutBucketNotificationConfiguration = promisify(
  s3.putBucketNotificationConfiguration.bind(s3)
);

// LAMBDA
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncCreateLambdaFunction = promisify(lambda.createFunction.bind(lambda));

// IAM
const asyncCreateLambdaRole = promisify(iam.createRole.bind(iam));
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));

module.exports = {
  asyncListDistributions,
  asyncDeleteDistribution,
  asyncListBuckets,
  asyncListBucketObjects,
  asyncDeleteBucketObjects,
  asyncCreateS3Bucket,
  asyncDeleteS3Bucket,
  asyncPutBucketPolicy,
  asyncUploadToBucket,
  asyncPutBucketNotificationConfiguration,
  asyncCreateCloudfrontDistribution,
  asyncAddPermission,
  asyncCreateLambdaFunction,
  asyncCreateLambdaRole,
  asyncAttachRolePolicy,
};

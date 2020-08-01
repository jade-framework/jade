const { promisify } = require("util");
const S3 = require("aws-sdk/clients/s3");
const CloudFront = require("aws-sdk/clients/cloudfront");
const AWS = require("aws-sdk/global");
const Lambda = require("aws-sdk/clients/lambda");
const awsIAM = require("aws-sdk/clients/iam");
const EC2 = require("aws-sdk/clients/ec2");
const { getRegion } = require("../util/getRegion");

// TODO: refactor to { apiVersion, region }
const region = getRegion();
const apiVersion = "latest";

AWS.config.update({ region: "us-east-1" });

const s3 = new S3({ apiVersion: "2006-03-01" });
const cloudfront = new CloudFront({ apiVersion: "2019-03-26" });
const lambda = new Lambda();
const iam = new awsIAM({ apiVersion: "2010-05-08", region });
const ec2 = new EC2({ apiVersion, region });

// CLOUDFRONT
const asyncCreateCloudfrontDistribution = promisify(
  cloudfront.createDistribution.bind(cloudfront)
);
// const asyncListDistributions = promisify(
//   cloudfront.listDistributions.bind(cloudfront)
// );
// const asyncDeleteDistribution = promisify(
//   cloudfront.deleteDistribution.bind(cloudfront)
// );
// const asyncGetDistribution = promisify(
//   cloudfront.getDistribution.bind(cloudfront)
// );

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
const asyncHeadBucket = promisify(s3.headBucket.bind(s3));

// LAMBDA
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncCreateLambdaFunction = promisify(lambda.createFunction.bind(lambda));
const asyncDeleteLambdaFunction = promisify(lambda.deleteFunction.bind(lambda));

// IAM
const asyncCreateLambdaRole = promisify(iam.createRole.bind(iam));
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncCreateInstanceProfile = promisify(
  iam.createInstanceProfile.bind(iam)
);
const asyncAddRoleToProfile = promisify(iam.addRoleToInstanceProfile.bind(iam));
const asyncGetRole = promisify(iam.getRole.bind(iam));

// EC2
const asyncCreateSecurityGroup = promisify(ec2.createSecurityGroup.bind(ec2));
const asyncDescribeSecurityGroups = promisify(
  ec2.describeSecurityGroups.bind(ec2)
);
const asyncAuthorizeSecurityGroupIngress = promisify(
  ec2.authorizeSecurityGroupIngress.bind(ec2)
);
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncDescribeInstances = promisify(ec2.describeInstances.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncAssociateIamInstanceProfile = promisify(
  ec2.associateIamInstanceProfile.bind(ec2)
);
const asyncWaitFor = promisify(ec2.waitFor.bind(ec2));
const asyncDescribeImages = promisify(ec2.describeImages.bind(ec2));

module.exports = {
  // asyncGetDistribution,
  // asyncListDistributions,
  // asyncDeleteDistribution,
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
  asyncCreateRole,
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
  asyncCreateKeyPair,
  asyncDescribeInstances,
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncWaitFor,
  asyncDescribeImages,
  asyncHeadBucket,
  asyncGetRole,
};

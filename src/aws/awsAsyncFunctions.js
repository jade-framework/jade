const { promisify } = require('util');
const S3 = require('aws-sdk/clients/s3');
const CloudFront = require('aws-sdk/clients/cloudfront');
const AWS = require('aws-sdk');
const Lambda = require('aws-sdk/clients/lambda');
const IAM = require('aws-sdk/clients/iam');
const EC2 = require('aws-sdk/clients/ec2');
const STS = require('aws-sdk/clients/sts');
const Dynamo = require('aws-sdk/clients/dynamodb');
const { getRegion } = require('../server/getRegion');

const region = getRegion();
const apiVersion = 'latest';

AWS.config.update({ apiVersion, region });

const s3 = new S3();
const cloudFront = new CloudFront();
const lambda = new Lambda();
const iam = new IAM();
const ec2 = new EC2();
const sts = new STS();
const dynamo = new Dynamo();

// CLOUDFRONT
const asyncCreateCloudFrontDistribution = promisify(
  cloudFront.createDistribution.bind(cloudFront),
);
const asyncUpdateCloudFrontDistribution = promisify(
  cloudFront.updateDistribution.bind(cloudFront),
);
const asyncGetCloudFrontDistributionConfig = promisify(
  cloudFront.getDistributionConfig.bind(cloudFront),
);
const asyncCreateCloudFrontInvalidation = promisify(
  cloudFront.createInvalidation.bind(cloudFront),
);

const asyncListCloudFrontDistributions = promisify(
  cloudFront.listDistributions.bind(cloudFront),
);
const asyncDeleteCloudFrontDistribution = promisify(
  cloudFront.deleteDistribution.bind(cloudFront),
);
const asyncCloudFrontWaitFor = promisify(cloudFront.waitFor.bind(cloudFront));

// S3
const asyncListBuckets = promisify(s3.listBuckets.bind(s3));
const asyncListBucketObjects = promisify(s3.listObjects.bind(s3));
const asyncDeleteBucketObjects = promisify(s3.deleteObjects.bind(s3));
const asyncCreateS3Bucket = promisify(s3.createBucket.bind(s3));
const asyncDeleteS3Bucket = promisify(s3.deleteBucket.bind(s3));
const asyncPutBucketPolicy = promisify(s3.putBucketPolicy.bind(s3));
const asyncUploadToBucket = promisify(s3.putObject.bind(s3));
const asyncPutBucketNotificationConfiguration = promisify(
  s3.putBucketNotificationConfiguration.bind(s3),
);
const asyncHeadBucket = promisify(s3.headBucket.bind(s3));
const asyncPutBucketTagging = promisify(s3.putBucketTagging.bind(s3));
const asyncGetBucketTagging = promisify(s3.getBucketTagging.bind(s3));
const asyncPutBucketWebsite = promisify(s3.putBucketWebsite.bind(s3));

// LAMBDA
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncCreateLambdaFunction = promisify(lambda.createFunction.bind(lambda));
const asyncDeleteLambdaFunction = promisify(lambda.deleteFunction.bind(lambda));
const asyncGetFunction = promisify(lambda.getFunction.bind(lambda));

// IAM
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncListAttachedRolePolicies = promisify(
  iam.listAttachedRolePolicies.bind(iam),
);
const asyncDeleteRole = promisify(iam.deleteRole.bind(iam));
const asyncCreateInstanceProfile = promisify(
  iam.createInstanceProfile.bind(iam),
);
const asyncGetInstanceProfile = promisify(iam.getInstanceProfile.bind(iam));
const asyncAddRoleToProfile = promisify(iam.addRoleToInstanceProfile.bind(iam));
const asyncRemoveRoleFromInstanceProfile = promisify(
  iam.removeRoleFromInstanceProfile.bind(iam),
);
const asyncDeleteInstanceProfile = promisify(
  iam.deleteInstanceProfile.bind(iam),
);
const asyncGetRole = promisify(iam.getRole.bind(iam));
const asyncIamWaitFor = promisify(iam.waitFor.bind(iam));
const asyncDetachRolePolicy = promisify(iam.detachRolePolicy.bind(iam));
const asyncListAttachedUserPolicy = promisify(
  iam.listAttachedUserPolicies.bind(iam),
);
const asyncGetGroup = promisify(iam.getGroup.bind(iam));
const asyncListAttachedGroupPolicies = promisify(
  iam.listAttachedGroupPolicies.bind(iam),
);
const asyncCreateGroup = promisify(iam.createGroup.bind(iam));
const asyncAttachGroupPolicy = promisify(iam.attachGroupPolicy.bind(iam));
const asyncDeleteGroup = promisify(iam.deleteGroup.bind(iam));
const asyncDetachGroupPolicy = promisify(iam.detachGroupPolicy.bind(iam));
const asyncAddUserToGroup = promisify(iam.addUserToGroup.bind(iam));
const asyncRemoveUserFromGroup = promisify(iam.removeUserFromGroup.bind(iam));

// EC2
const asyncCreateSecurityGroup = promisify(ec2.createSecurityGroup.bind(ec2));
const asyncDescribeSecurityGroups = promisify(
  ec2.describeSecurityGroups.bind(ec2),
);
const asyncAuthorizeSecurityGroupIngress = promisify(
  ec2.authorizeSecurityGroupIngress.bind(ec2),
);
const asyncDeleteSecurityGroup = promisify(ec2.deleteSecurityGroup.bind(ec2));
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncDescribeKeyPairs = promisify(ec2.describeKeyPairs.bind(ec2));
const asyncDeleteKeyPair = promisify(ec2.deleteKeyPair.bind(ec2));
const asyncDescribeInstances = promisify(ec2.describeInstances.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncAssociateIamInstanceProfile = promisify(
  ec2.associateIamInstanceProfile.bind(ec2),
);
const asyncEc2WaitFor = promisify(ec2.waitFor.bind(ec2));
const asyncDescribeImages = promisify(ec2.describeImages.bind(ec2));
const asyncStartInstances = promisify(ec2.startInstances.bind(ec2));
const asyncStopInstances = promisify(ec2.stopInstances.bind(ec2));
const asyncTerminateInstances = promisify(ec2.terminateInstances.bind(ec2));

// STS
const asyncGetCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));

// DYNAMO
const asyncDynamoCreateTable = promisify(dynamo.createTable.bind(dynamo));
const asyncDynamoPutItem = promisify(dynamo.putItem.bind(dynamo));
const asyncDynamoWaitFor = promisify(dynamo.waitFor.bind(dynamo));
const asyncDynamoDescribeTable = promisify(dynamo.describeTable.bind(dynamo));
const asyncDynamoDeleteTable = promisify(dynamo.deleteTable.bind(dynamo));
const asyncDynamoListTables = promisify(dynamo.listTables.bind(dynamo));
const asyncDynamoListTagsOfResource = promisify(
  dynamo.listTagsOfResource.bind(dynamo),
);
const asyncDynamoScan = promisify(dynamo.scan.bind(dynamo));
const asyncDynamoUpdateItem = promisify(dynamo.updateItem.bind(dynamo));

module.exports = {
  asyncListBuckets,
  asyncListBucketObjects,
  asyncDeleteBucketObjects,
  asyncCreateS3Bucket,
  asyncDeleteS3Bucket,
  asyncPutBucketPolicy,
  asyncUploadToBucket,
  asyncPutBucketNotificationConfiguration,
  asyncCreateCloudFrontDistribution,
  asyncUpdateCloudFrontDistribution,
  asyncGetCloudFrontDistributionConfig,
  asyncCreateCloudFrontInvalidation,
  asyncListCloudFrontDistributions,
  asyncDeleteCloudFrontDistribution,
  asyncCloudFrontWaitFor,
  asyncAddPermission,
  asyncCreateLambdaFunction,
  asyncDeleteLambdaFunction,
  asyncAttachRolePolicy,
  asyncCreateRole,
  asyncDeleteRole,
  asyncListAttachedRolePolicies,
  asyncDetachRolePolicy,
  asyncListAttachedUserPolicy,
  asyncGetGroup,
  asyncListAttachedGroupPolicies,
  asyncCreateGroup,
  asyncAttachGroupPolicy,
  asyncDeleteGroup,
  asyncDetachGroupPolicy,
  asyncAddUserToGroup,
  asyncRemoveUserFromGroup,
  asyncCreateInstanceProfile,
  asyncGetInstanceProfile,
  asyncAddRoleToProfile,
  asyncRemoveRoleFromInstanceProfile,
  asyncDeleteInstanceProfile,
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
  asyncDeleteSecurityGroup,
  asyncCreateKeyPair,
  asyncDescribeKeyPairs,
  asyncDeleteKeyPair,
  asyncDescribeInstances,
  asyncStartInstances,
  asyncStopInstances,
  asyncTerminateInstances,
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncEc2WaitFor,
  asyncDescribeImages,
  asyncHeadBucket,
  asyncGetRole,
  asyncIamWaitFor,
  asyncGetFunction,
  asyncGetCallerIdentity,
  asyncPutBucketTagging,
  asyncGetBucketTagging,
  asyncDynamoCreateTable,
  asyncDynamoPutItem,
  asyncDynamoWaitFor,
  asyncDynamoDescribeTable,
  asyncDynamoScan,
  asyncDynamoUpdateItem,
  asyncDynamoDeleteTable,
  asyncDynamoListTables,
  asyncDynamoListTagsOfResource,
  asyncPutBucketWebsite,
};

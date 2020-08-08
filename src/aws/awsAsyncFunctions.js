const { promisify } = require('util');
const S3 = require('aws-sdk/clients/s3');
const CloudFront = require('aws-sdk/clients/cloudfront');
const AWS = require('aws-sdk/global');
const Lambda = require('aws-sdk/clients/lambda');
const IAM = require('aws-sdk/clients/iam');
const EC2 = require('aws-sdk/clients/ec2');
const STS = require('aws-sdk/clients/sts');
const Dynamo = require('aws-sdk/clients/dynamodb');
const ApiGateway = require('aws-sdk/clients/apigateway');
const { getRegion } = require('../util/getRegion');

const region = getRegion();
const apiVersion = 'latest';

AWS.config.update({ apiVersion, region });

const s3 = new S3();
const cloudfront = new CloudFront();
const lambda = new Lambda();
const iam = new IAM();
const ec2 = new EC2();
const sts = new STS();
const dynamo = new Dynamo();
const apigateway = new ApiGateway();

// CLOUDFRONT
const asyncCreateCloudfrontDistribution = promisify(
  cloudfront.createDistribution.bind(cloudfront),
);
const asyncUpdateCloudfrontDistribution = promisify(
  cloudfront.updateDistribution.bind(cloudfront),
);
const asyncGetCloudfrontDistributionConfig = promisify(
  cloudfront.getDistributionConfig.bind(cloudfront),
);
const asyncCreateCloudfrontInvalidation = promisify(
  cloudfront.createInvalidation.bind(cloudfront),
);

const asyncListDistributions = promisify(
  cloudfront.listDistributions.bind(cloudfront),
);
const asyncDeleteDistribution = promisify(
  cloudfront.deleteDistribution.bind(cloudfront),
);
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
  s3.putBucketNotificationConfiguration.bind(s3),
);
const asyncHeadBucket = promisify(s3.headBucket.bind(s3));
const asyncPutBucketTagging = promisify(s3.putBucketTagging.bind(s3));
const asyncGetBucketTagging = promisify(s3.getBucketTagging.bind(s3));

// LAMBDA
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncCreateLambdaFunction = promisify(lambda.createFunction.bind(lambda));
const asyncDeleteLambdaFunction = promisify(lambda.deleteFunction.bind(lambda));
const asyncGetFunction = promisify(lambda.getFunction.bind(lambda));

// IAM
const asyncAttachRolePolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncDeleteRole = promisify(iam.deleteRole.bind(iam));
const asyncCreateInstanceProfile = promisify(
  iam.createInstanceProfile.bind(iam),
);
const asyncGetInstanceProfile = promisify(iam.getInstanceProfile.bind(iam));
const asyncAddRoleToProfile = promisify(iam.addRoleToInstanceProfile.bind(iam));
const asyncGetRole = promisify(iam.getRole.bind(iam));
const asyncIamWaitFor = promisify(iam.waitFor.bind(iam));
const asyncDetachRolePolicy = promisify(iam.detachRolePolicy.bind(iam));
const asyncListAttachedUserPolicy = promisify(
  iam.listAttachedUserPolicies.bind(iam),
);

// EC2
const asyncCreateSecurityGroup = promisify(ec2.createSecurityGroup.bind(ec2));
const asyncDescribeSecurityGroups = promisify(
  ec2.describeSecurityGroups.bind(ec2),
);
const asyncAuthorizeSecurityGroupIngress = promisify(
  ec2.authorizeSecurityGroupIngress.bind(ec2),
);
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

// STS
const asyncGetCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));

// DYNAMO
const asyncDynamoCreateTable = promisify(dynamo.createTable.bind(dynamo));
const asyncDynamoPutItem = promisify(dynamo.putItem.bind(dynamo));
const asyncDynamoWaitFor = promisify(dynamo.waitFor.bind(dynamo));
const asyncDynamoDescribeTable = promisify(dynamo.describeTable.bind(dynamo));

// ApiGateway
const asyncCreateRestApi = promisify(apigateway.createRestApi.bind(apigateway));
const asyncGetResources = promisify(apigateway.getResources.bind(apigateway));
const asyncPutMethod = promisify(apigateway.putMethod.bind(apigateway));
const asyncPutIntegration = promisify(
  apigateway.putIntegration.bind(apigateway),
);
const asyncCreateResource = promisify(
  apigateway.createResource.bind(apigateway),
);
const asyncCreateDeployment = promisify(
  apigateway.createDeployment.bind(apigateway),
);

module.exports = {
  // asyncGetDistribution,
  asyncListDistributions,
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
  asyncDeleteLambdaFunction,
  asyncAttachRolePolicy,
  asyncCreateRole,
  asyncDeleteRole,
  asyncCreateInstanceProfile,
  asyncGetInstanceProfile,
  asyncAddRoleToProfile,
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
  asyncCreateKeyPair,
  asyncDescribeKeyPairs,
  asyncDeleteKeyPair,
  asyncDescribeInstances,
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncEc2WaitFor,
  asyncDescribeImages,
  asyncHeadBucket,
  asyncGetRole,
  asyncIamWaitFor,
  asyncGetFunction,
  asyncUpdateCloudfrontDistribution,
  asyncGetCloudfrontDistributionConfig,
  asyncCreateCloudfrontInvalidation,
  asyncGetCallerIdentity,
  asyncPutBucketTagging,
  asyncGetBucketTagging,
  asyncDeleteLambdaFunction,
  asyncDetachRolePolicy,
  asyncDynamoCreateTable,
  asyncDynamoPutItem,
  asyncDynamoWaitFor,
  asyncDynamoDescribeTable,
  asyncCreateRestApi,
  asyncCreateResource,
  asyncGetResources,
  asyncPutMethod,
  asyncPutIntegration,
  asyncCreateDeployment,
  asyncListAttachedUserPolicy,
};

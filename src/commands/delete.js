const { deleteBucket } = require('../aws/s3/deleteBucket');
const {
  disableCloudFrontDistribution,
} = require('../aws/cloudfront/disableCloudFrontDistribution');
const {
  asyncDynamoScan,
  asyncDynamoUpdateItem,
  asyncGetCloudFrontDistributionConfig,
} = require('../aws/awsAsyncFunctions');
const { sendDeleteAppCommand } = require('../util/connect');
const { appsTableName } = require('../templates/constants');
const { confirmDelete } = require('../util/questions');
const { getBucketNames, appNotFound } = require('../util/helpers');
const { jadeErr, jadeLog } = require('../util/logger');

const updateAppsTableStatus = async (projectName, bucketName) => {
  const params = {
    ExpressionAttributeNames: {
      '#A': 'isActive',
      '#F': 'isFrozen',
    },
    ExpressionAttributeValues: {
      ':a': {
        BOOL: false,
      },
      ':f': {
        BOOL: true,
      },
    },
    Key: {
      projectName: {
        S: projectName,
      },
      bucketName: {
        S: bucketName,
      },
    },
    ReturnValues: 'NONE',
    TableName: appsTableName,
    UpdateExpression: 'SET #A = :a, #F = :f',
  };

  try {
    await asyncDynamoUpdateItem(params);
  } catch (err) {
    jadeErr(err);
  }
};

const removeApp = async (match) => {
  jadeLog('Beginning app deletion.');
  let { projectName, bucketName, publicIp, cloudFrontDistributionId } = match;
  projectName = projectName.S;
  bucketName = bucketName.S;
  publicIp = publicIp.S;
  cfdId = cloudFrontDistributionId.S;

  jadeLog('Deleting buckets...');
  await Promise.all(
    getBucketNames(bucketName).map((name) => {
      return (async () => {
        await deleteBucket(name);
      })();
    }),
  );
  jadeLog('Buckets deleted.');

  // update DynamoDb
  jadeLog('Updating DynamoDB...');
  await updateAppsTableStatus(projectName, bucketName);
  jadeLog('DynamoDB updated.');

  // disable CloudFront
  jadeLog('Disabling CloudFront distribution...');
  const cloudFrontConfig = await asyncGetCloudFrontDistributionConfig({
    Id: cfdId,
  });
  let eTag = cloudFrontConfig.ETag;

  let data = await disableCloudFrontDistribution(cfdId, cloudFrontConfig, eTag);
  eTag = data.ETag;
  jadeLog('CloudFront distribution disabled.');

  // delete CloudFront and EC2
  const promise = sendDeleteAppCommand(eTag, publicIp);

  Promise.all([promise]).then(() =>
    jadeLog(`The ${projectName} app is deleted.`),
  );

  jadeLog('Your Jade app has been deleted.');
  jadeLog(
    'Due to how CloudFront is set up, Jade will take between 5-90 minutes to delete CloudFront and EC2 on AWS. Please confirm your app has been deleted via the AWS console after this time. For more info, please visit: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowToDeleteDistribution.html.',
  );
};

const deleteApp = async (args) => {
  const appName = args[0];
  if (!appName) return appNotFound();
  const params = {
    TableName: appsTableName,
  };
  try {
    const apps = await asyncDynamoScan(params);
    const items = apps.Items;
    if (apps.Items.length > 0) {
      const match = items.find(
        (item) => item.projectName.S.trim() === appName.trim(),
      );
      if (match && match.isActive.BOOL) {
        const confirm = await confirmDelete();
        if (confirm) await removeApp(match);
      } else {
        return appNotFound();
      }
    } else {
      return appNotFound();
    }
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteApp };

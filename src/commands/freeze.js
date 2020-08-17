const {
  asyncDynamoScan,
  asyncStopInstances,
  asyncDescribeInstances,
  asyncDynamoUpdateItem,
} = require('../aws/awsAsyncFunctions');
const { appsTableName } = require('../templates/constants');
const { appNotFound } = require('../util/helpers');
const { jadeErr, jadeLog } = require('../util/logger');

const updateAppsTableStatus = async (projectName, bucketName) => {
  const params = {
    ExpressionAttributeNames: {
      '#F': 'isFrozen',
    },
    ExpressionAttributeValues: {
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
    UpdateExpression: 'SET #F = :f',
  };

  try {
    jadeLog('Updating DynamoDB...');
    await asyncDynamoUpdateItem(params);
    jadeLog('DynamoDB updated.');
  } catch (err) {
    jadeErr(err);
  }
};

const freezeEc2 = async (match) => {
  let { projectName, bucketName } = match;
  projectName = projectName.S;
  bucketName = bucketName.S;

  try {
    const describeParams = {
      Filters: [
        {
          Name: 'tag:Name',
          Values: [`${projectName}'s Jade EC2 Instance`],
        },
      ],
    };
    jadeLog(`Retrieving ${projectName}'s EC2 instance...`);
    const describeRes = await asyncDescribeInstances(describeParams);
    const data = describeRes.Reservations[0].Instances[0];
    const status = data.State.Name;
    if (
      status === 'stopped' ||
      status === 'stopping' ||
      status === 'shutting-down'
    ) {
      jadeLog('The EC2 instance is already frozen.');
      return;
    } else if (status === 'terminated') {
      jadeLog('The EC2 instance has already been terminated.');
      return;
    }
    const instanceId = data.InstanceId;
    jadeLog(`Stopping ${projectName}'s EC2 instance...`);
    await asyncStopInstances({ InstanceIds: [instanceId] });
    jadeLog(`${projectName}'s EC2 instance has now been stopped.`);
    await updateAppsTableStatus(projectName, bucketName);
  } catch (err) {
    jadeErr(err);
  }
};

const freeze = async (args) => {
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
      if (match) {
        await freezeEc2(match);
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

module.exports = { freeze };

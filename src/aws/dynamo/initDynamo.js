const uuid = require('uuid');

const { readConfig } = require('../../util/fileUtils');
const { createDynamoTable } = require('./createDynamoTable');
const { putDynamoItem } = require('./putDynamoItems');
const { jadeLog } = require('../../util/logger');

const appsItemToPut = async () => {
  const jsonItems = await readConfig(process.cwd());
  const formattedItem = jsonItems.map(
    ({
      projectName,
      gitProvider,
      gitUrl,
      bucketName,
      cloudFrontOriginId,
      cloudFrontOriginDomain,
    }) => ({
      projectId: {
        S: uuid.v4(),
      },
      projectName: {
        S: projectName,
      },
      gitProvider: {
        S: gitProvider,
      },
      gitUrl: {
        S: gitUrl,
      },
      bucketName: {
        S: bucketName,
      },
      cloudFrontOriginId: {
        S: cloudFrontOriginId,
      },
      cloudFrontOriginDomain: {
        S: cloudFrontOriginDomain,
      },
    }),
  )[0];
  return formattedItem;
};
const versionsItemToPut = async () => {
  const jsonItems = await readConfig(process.cwd());
  const formattedItem = jsonItems.map(
    ({
      projectName,
      gitProvider,
      gitExists,
      gitUrl,
      bucketName,
      bucketNames,
      lambdaNames,
      cloudFrontOriginId,
      cloudFrontOriginDomain,
    }) => ({
      versionId: {
        S: uuid.v4(),
      },
      projectName: {
        S: projectName,
      },
      gitProvider: {
        S: gitProvider,
      },
      gitExists: {
        BOOL: gitExists,
      },
      gitUrl: {
        S: gitUrl,
      },
      bucketName: {
        S: bucketName,
      },
      bucketNames: {
        SS: bucketNames,
      },
      lambdaNames: {
        S: lambdaNames,
      },
      cloudFrontOriginId: {
        S: cloudFrontOriginId,
      },
      cloudFrontOriginDomain: {
        S: cloudFrontOriginDomain,
      },
    }),
  )[0];
  return formattedItem;
};

const initDynamo = async (appsTableName, versionsTableName) => {
  try {
    // Create Jade Projects Summary Table
    const createPromise1 = createDynamoTable(
      appsTableName,
      'projectId',
      'projectName',
    );
    // Create App Versions Table
    const createPromise2 = await createDynamoTable(
      versionsTableName,
      'versionId',
      'projectName',
    );
    await Promise.all([createPromise1, createPromise2]);

    // Put initial app items to tables
    const appsItem = await appsItemToPut();
    const versionsItem = await versionsItemToPut();
    const putPromise1 = putDynamoItem(appsTableName, appsItem);
    const putPromise2 = putDynamoItem(versionsTableName, versionsItem);
    await Promise.all([putPromise1, putPromise2]);
    jadeLog('DynamoDB setup complete.');
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initDynamo };
// initDynamo('JadeProjects', 'JadeProjectVersions');

/*
CREATE RESPONSE
{
  Table: {
    AttributeDefinitions: [ [Object], [Object] ],
    TableName: 'MyJadeProject',
    KeySchema: [ [Object], [Object] ],
    TableStatus: 'ACTIVE',
    CreationDateTime: 2020-08-11T18:47:45.119Z,
    ProvisionedThroughput: {
      NumberOfDecreasesToday: 0,
      ReadCapacityUnits: 0,
      WriteCapacityUnits: 0
    },
    TableSizeBytes: 0,
    ItemCount: 0,
    TableArn: 'arn:aws:dynamodb:us-west-2:434812305662:table/MyJadeProject',
    TableId: 'aeb9b4e0-8dee-4262-a1f6-5ee5f88d0d62',
    BillingModeSummary: {
      BillingMode: 'PAY_PER_REQUEST',
      LastUpdateToPayPerRequestDateTime: 2020-08-11T18:47:45.119Z
    }
  }
}
*/

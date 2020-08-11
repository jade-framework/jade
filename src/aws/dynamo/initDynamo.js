const uuid = require('uuid');

const { readConfig } = require('../../util/fileUtils');
const { createDynamoTable } = require('./createDynamoTable');
const { putDynamoItem } = require('./putDynamoItems');
const { jadeLog } = require('../../util/logger');

const appItemToPut = async () => {
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

const initDynamo = async (tableName) => {
  try {
    await createDynamoTable(tableName);
    const item = await appItemToPut();
    await putDynamoItem(tableName, item);
    jadeLog('DynamoDB setup complete.');
  } catch (error) {
    console.log(error);
  }
};

// module.exports = { initDynamo };
initDynamo('MyJadeProject4');

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

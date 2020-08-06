// @TODO: Need to wait for table to be created before putting items

const uuid = require('uuid');

const {
  asyncCreateTable,
  asyncPutItem,
  asyncDynamoWaitFor,
} = require('../awsAsyncFunctions');

const createDynamoTable = async (tableName, appName) => {
  console.log('Creating DynamoDB table...');

  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'AppID',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'AppID',
        KeyType: 'HASH',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  const putParams = {
    TableName: tableName,
    Item: {
      AppID: {
        S: uuid.v4(),
      },
      AppName: {
        S: appName,
      },
    },
  };

  try {
    const createResponse = await asyncCreateTable(params);
    console.log(`DynamoDB table ${tableName} created.`, createResponse);

    await asyncDynamoWaitFor('tableExists', { TableName: tableName });

    const putResponse = await asyncPutItem(putParams);
    console.log(`Put items to table ${tableName}.`, putResponse);
  } catch (error) {
    console.log('Error creating DynamoDB table', error);
  }
};

module.exports = { createDynamoTable };
createDynamoTable('Jade', 'My App');

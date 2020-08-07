// @TODO: Need to wait for table to be created before putting items

const uuid = require('uuid');

const {
  asyncDynamoCreateTable,
  asyncDynamoDescribeTable,
  asyncDynamoWaitFor,
} = require('../awsAsyncFunctions');

// to discuss: AWS.config.update({endpoint: "http://localhost:8000"})

const createDynamoTable = async (tableName) => {
  console.log('Creating DynamoDB table...');

  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: 'AppId',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'AppId',
        AttributeType: 'S',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    Tags: [
      {
        Key: 'project',
        Value: 'jade',
      },
    ],
  };

  try {
    const createResponse = await asyncDynamoCreateTable(params);

    await asyncDynamoWaitFor('tableExists', { TableName: tableName });
    console.log(await asyncDynamoDescribeTable({ TableName: tableName }));
    console.log(`DynamoDB table ${tableName} created.`, createResponse);
  } catch (error) {
    console.log('Error creating DynamoDB table', error);
  }
};

module.exports = { createDynamoTable };

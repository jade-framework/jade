const { jadeLog } = require('../../util/logger');

const {
  asyncDynamoCreateTable,
  asyncDynamoDescribeTable,
  asyncDynamoWaitFor,
} = require('../awsAsyncFunctions');

// to discuss: AWS.config.update({endpoint: "http://localhost:8000"})

const createDynamoTable = async (tableName, primaryKeyName) => {
  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: primaryKeyName,
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: primaryKeyName,
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

  let tableInfo;
  try {
    jadeLog('Creating DynamoDB table...');
    await asyncDynamoCreateTable(params);
    jadeLog(`DynamoDB table ${tableName} created.`);
    jadeLog(`Waiting for table to be activated...`);
    await asyncDynamoWaitFor('tableExists', { TableName: tableName });
    jadeLog(`DynamoDB table ready.`);

    tableInfo = await asyncDynamoDescribeTable({ TableName: tableName });
  } catch (error) {
    console.log('Error creating DynamoDB table', error);
  }
  return tableInfo;
};

module.exports = { createDynamoTable };

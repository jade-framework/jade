const { jadeLog, jadeErr } = require('../../util/logger');

const {
  asyncDynamoCreateTable,
  asyncDynamoDescribeTable,
  asyncDynamoWaitFor,
} = require('../awsAsyncFunctions');

const createDynamoTable = async (
  tableName,
  primaryKeyName,
  secondaryKeyName,
) => {
  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: primaryKeyName,
        KeyType: 'HASH',
      },
      {
        AttributeName: secondaryKeyName,
        KeyType: 'RANGE',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: primaryKeyName,
        AttributeType: 'S',
      },
      {
        AttributeName: secondaryKeyName,
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
    jadeErr('Error creating DynamoDB table', error);
  }
  return tableInfo;
};

module.exports = { createDynamoTable };

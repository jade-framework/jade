const { jadeLog, jadeErr } = require('../../util/logger');
const { asyncDynamoDeleteTable } = require('../awsAsyncFunctions');

const deleteDynamoTable = async (tableName) => {
  let response;
  try {
    jadeLog(`Deleting DynamoDB table ${tableName}...`);
    await asyncDynamoDeleteTable({ TableName: tableName });
    jadeLog(`DynamoDB table ${tableName} deleted.`);
  } catch (error) {
    jadeErr('Error creating DynamoDB table');
    console.log(error);
  }
  return response;
};
module.exports = deleteDynamoTable;

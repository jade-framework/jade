const { jadeLog, jadeErr } = require('../../util/logger');
const {
  asyncDynamoListTables,
  asyncDynamoDescribeTable,
  asyncDynamoListTagsOfResource,
  asyncDynamoDeleteTable,
  asyncDynamoWaitFor,
} = require('../awsAsyncFunctions');

const deleteDynamoTable = async (tableName) => {
  let response;
  try {
    jadeLog(`Deleting DynamoDB table ${tableName}...`);
    await asyncDynamoDeleteTable({ TableName: tableName });
    await asyncDynamoWaitFor('tableNotExists', { TableName: tableName });
    jadeLog(`DynamoDB table ${tableName} deleted.`);
  } catch (error) {
    jadeErr(error);
  }
  return response;
};

const deleteAllDynamoTables = async () => {
  try {
    jadeLog(`Deleting all DynamoDB tables...`);
    const allTables = await asyncDynamoListTables();
    allTables.TableNames.forEach(async (tableName) => {
      const tableInfo = await asyncDynamoDescribeTable({
        TableName: tableName,
      });
      const tags = await asyncDynamoListTagsOfResource({
        ResourceArn: tableInfo.Table.TableArn,
      });
      const isJadeTable =
        tags.Tags && tags.Tags.some((tag) => tag.Value === 'jade');

      if (isJadeTable) {
        try {
          await deleteDynamoTable(tableName);
        } catch (error) {
          jadeErr(error);
        }
      }
      return true;
    });
  } catch (error) {
    jadeErr(error);
  }
};

module.exports = { deleteDynamoTable, deleteAllDynamoTables };

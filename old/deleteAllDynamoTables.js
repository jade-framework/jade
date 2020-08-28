const { jadeLog, jadeErr } = require('../src/util/logger');
const {
  asyncDynamoListTables,
  asyncDynamoDescribeTable,
  asyncDynamoListTagsOfResource,
} = require('../src/aws/awsAsyncFunctions');
const deleteDynamoTable = require('../src/aws/dynamo/deleteDynamoTable');

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
    });
  } catch (error) {
    jadeErr('Error deleting DynamoDB tables:');
    jadeErr(error);
  }
};
module.exports = { deleteAllDynamoTables };

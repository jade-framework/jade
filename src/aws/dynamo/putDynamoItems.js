const { asyncDynamoPutItem } = require('../awsAsyncFunctions');

const putDynamoItem = async (tableName, itemName, item) => {
  const putParams = {
    TableName: tableName,
    Item: {
      AppId: {
        S: itemName,
      },
      item,
    },
  };
  const putResponse = await asyncDynamoPutItem(putParams);
  console.log(`Put items to table ${tableName}.`, putResponse);
};

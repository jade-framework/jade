const { asyncDynamoPutItem } = require('../awsAsyncFunctions');

const putDynamoItem = async (tableName, { itemName, ...item }) => {
  try {
    const putParams = {
      TableName: tableName,
      Item: {
        AppId: {
          S: itemName,
        },
        Data: {
          M: item,
        },
      },
    };
    await asyncDynamoPutItem(putParams);
    console.log(`Put items to table ${tableName}.`);
  } catch (err) {
    console.log(err);
  }
};

const putDynamoItems = async (tableName, items) => {
  try {
    const promises = items.map((item) => {
      return (async () => {
        await putDynamoItem(tableName, item);
      })();
    });
    await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { putDynamoItem, putDynamoItems };

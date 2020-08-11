const { asyncDynamoPutItem } = require('../awsAsyncFunctions');
const { jadeLog } = require('../../util/logger');

const putDynamoItem = async (tableName, items) => {
  let putResponse;
  try {
    const putParams = {
      TableName: tableName,
      Item: items,
    };
    putResponse = await asyncDynamoPutItem(putParams);
    jadeLog(`Put items to table ${tableName}.`);
  } catch (err) {
    console.log(err);
  }
  return putResponse;
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

module.exports = { putDynamoItems, putDynamoItem };

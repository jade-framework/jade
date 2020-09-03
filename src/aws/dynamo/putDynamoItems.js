const { asyncDynamoPutItem } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const putDynamoItem = async (tableName, items) => {
  let putResponse;
  try {
    const putParams = {
      TableName: tableName,
      Item: items,
    };
    putResponse = await asyncDynamoPutItem(putParams);
    jadeLog(`Put item to table ${tableName}.`);
  } catch (err) {
    jadeErr(err);
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
    jadeErr(err);
  }
};

module.exports = { putDynamoItems, putDynamoItem };

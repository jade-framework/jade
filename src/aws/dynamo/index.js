const { createDynamoTable } = require('./createDynamoTable');
const { putDynamoItem } = require('./putDynamoItems');
const { initDynamo, addAppToDynamo } = require('./initDynamo');
const {
  deleteDynamoTable,
  deleteAllDynamoTables,
} = require('./deleteDynamoTable');

module.exports = {
  createDynamoTable,
  putDynamoItem,
  initDynamo,
  addAppToDynamo,
  deleteDynamoTable,
  deleteAllDynamoTables,
};

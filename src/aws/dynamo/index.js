const { initDynamo, addAppToDynamo } = require('./initDynamo');
const { deleteAllDynamoTables } = require('./deleteAllDynamoTables');

module.exports = { initDynamo, addAppToDynamo, deleteAllDynamoTables };

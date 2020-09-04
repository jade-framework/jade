const {
  createDynamoTable,
  putDynamoItem,
  deleteDynamoTable,
  deleteAllDynamoTables,
} = require('../src/aws/dynamo');

const tableName = 'testDynamoTable';
const primaryKeyName = 'testPrimaryKey';
const secondaryKeyName = 'testSecondaryKey';

const arrayHasMatch = (arr, reg) => {
  return arr.filter((item) => !!item.match(reg)).length > 0;
};

describe('AWS DynamodB', () => {
  let consoleOutput = [];
  const originalLog = console.log;
  const mockedLog = (...output) => consoleOutput.push(...output);

  beforeEach(async () => {
    jest.setTimeout(30000);
    // jest.useFakeTimers();
    console.log = mockedLog;
  });

  afterEach(async () => {
    console.log = originalLog;
  });

  describe('Table', () => {
    describe('can be created', () => {
      let table;
      beforeEach(async () => {
        table = await createDynamoTable(
          tableName,
          primaryKeyName,
          secondaryKeyName,
        );
      });

      afterEach(async () => {
        await deleteDynamoTable(tableName);
        console.warn(consoleOutput);
        consoleOutput = [];
      });

      test('table successfully created', async () => {
        expect(table).toMatchObject({ Table: { TableName: tableName } });
      });

      test('only once if it already exists', async () => {
        const newTable = await createDynamoTable(
          tableName,
          primaryKeyName,
          secondaryKeyName,
        );
        expect(newTable).toBeUndefined();
      });

      test('and an item can be put', async () => {
        const params = {
          [primaryKeyName]: { S: 'itemPrimaryKey' },
          [secondaryKeyName]: { S: 'itemSecondaryKey' },
        };
        await putDynamoItem(tableName, params);
        const isPut = arrayHasMatch(consoleOutput, 'Put item to table');
        expect(isPut).toBe(true);
      });
    });

    describe('can be deleted', () => {
      let table;
      const tableName2 = `${tableName}2`;
      beforeEach(async () => {
        table = await createDynamoTable(
          tableName2,
          primaryKeyName,
          secondaryKeyName,
        );
      });

      afterEach(async () => {
        console.warn(consoleOutput);
        consoleOutput = [];
      });

      test('one at a time', async () => {
        await deleteDynamoTable(tableName2);
        const isDeleted = arrayHasMatch(consoleOutput, `${tableName2} deleted`);
        expect(isDeleted).toBe(true);
      });

      test('all at once', async () => {
        const tableName3 = `${tableName}3`;
        await createDynamoTable(tableName3, primaryKeyName, secondaryKeyName);
        await deleteAllDynamoTables();
        const isDeleted =
          arrayHasMatch(consoleOutput, `${tableName2} deleted`) &&
          arrayHasMatch(consoleOutput, `${tableName3} deleted`);
        expect(isDeleted).toBe(true);
      });
    });
  });
});

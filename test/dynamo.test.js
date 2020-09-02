const {
  createDynamoTable,
  putDynamoItem,
  deleteDynamoTable,
  deleteAllDynamoTables,
} = require('../src/aws/dynamo');

const tableName = 'testDynamoTable';
const primaryKeyName = 'testPrimaryKey';
const secondaryKeyName = 'testSecondaryKey';

describe('AWS DynamodB', () => {
  beforeEach(async () => {
    jest.setTimeout(30000);
    jest.spyOn(console, 'log').mockImplementation(() => {});
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
      });

      test('table successfully created', async () => {
        console.log(table);
        // expect(table).toMatchObject({ TableName: tableName });
      });

      test('only once if it already exists', async () => {
        const newTable = await createDynamoTable(
          tableName,
          primaryKeyName,
          secondaryKeyName,
        );
        console.log(`new table ${newTable}`);
        expect(newTable).toBeUndefined();
      });
      test('and an item can be put', async () => {
        const params = {
          [primaryKeyName]: { S: 'itemPrimaryKey' },
          [secondaryKeyName]: { S: 'itemSecondaryKey' },
        };
        const item = await putDynamoItem(tableName, params);
        const expected = { what: 'is here???' };
        expect(item).toMatchObject(expected);
      });
    });

    describe('can be deleted', () => {
      test('one at a time', async () => {});

      test('all at once', () => {});
    });
  });
});

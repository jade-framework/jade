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
    // jest.spyOn(console, 'log').mockImplementation(() => {});
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
        const item = await putDynamoItem(tableName, params);
        const expected = {};
        expect(item).toMatchObject(expected);
      });

      describe('and can be deleted', () => {
        test('one at a time', async () => {
          const result = await deleteDynamoTable(tableName);
          console.log('table: ', result);
          const expected = { TableDescription: { TableName: tableName } };
          expect(result).toMatchObject(expected);
        });

        test('all at once', () => {});
      });
    });
  });
});

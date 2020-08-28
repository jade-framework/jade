// const AWSMock = require('aws-sdk-mock');
// const AWS = require('aws-sdk');
jest.mock('../src/aws/awsAsyncFunctions', () =>
  require('../src/aws/__mocks__/awsAsyncFunctions'),
);

const {
  createDynamoTable,
  putDynamoItem,
  deleteDynamoTable,
  deleteAllDynamoTables,
} = require('../src/aws/dynamo');
// const { asyncDynamoDescribeTable } = require('../src/aws/awsAsyncFunctions');

// AWSMock.setSDKInstance(AWS);

// AWSMock.mock('DynamoDB', 'putItem', (params, cb) => {
//   cb(null, 'items put in table');
// });

// AWSMock.mock('DynamoDB', 'createTable', (params, cb) => {
//   cb(null, `table created, ${params}`);
// });

// AWSMock.mock('DynamoDB', 'waitFor', (state, params, cb) => {
//   cb(null, `${state} and ${params}`);
// });

// AWSMock.mock('DynamoDB', 'describeTable', (params, cb) => {
//   cb(null, `describe table, ${params}`);
// });

// const asyncDynamoCreateTable = promisify(dynamo.createTable.bind(dynamo));

const tableName = 'testDynamoTable';
const primaryKeyName = 'testPrimaryKey';
const secondaryKeyName = 'testSecondaryKey';

// console.log(Dynamo);

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
        // console.log(table);
      });

      afterEach(async () => {
        await deleteDynamoTable(tableName);
      });

      test('table successfully created', async () => {
        console.log(table);
        // expect(table).toMatchObject({ TableName: tableName });
      });

      // test('only once if it already exists', async () => {
      //   const newTable = await createDynamoTable(
      //     tableName,
      //     primaryKeyName,
      //     secondaryKeyName,
      //   );
      //   console.log(`new table ${newTable}`);
      //   expect(newTable).toBeUndefined();
      // });
      // test('and an item can be put', async () => {
      //   const params = {
      //     [primaryKeyName]: { S: 'itemPrimaryKey' },
      //     [secondaryKeyName]: { S: 'itemSecondaryKey' },
      //   };
      //   const item = await putDynamoItem(tableName, params);
      //   const expected = { what: 'is here???' };
      //   expect(item).toMatchObject(expected);
      // });
    });

    describe('can be deleted', () => {
      test('one at a time', async () => {});

      test('all at once', () => {});
    });
  });
});

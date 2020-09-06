const {
  asyncListBuckets,
  asyncGetBucketTagging,
  asyncGetBucketPolicy,
  asyncHeadBucket,
} = require('../src/aws/awsAsyncFunctions');

const { getBucketNames } = require('../src/util/helpers');
const { deleteBucket } = require('../src/aws/s3/deleteBucket');

const bucketName = 'jadetests3';

const arrayHasMatch = (arr, reg) => {
  return arr.filter((item) => !!item.match(reg)).length > 0;
};

describe('AWS S3', () => {
  let consoleOutput = [];
  const originalLog = console.log;
  const mockedLog = (...output) => consoleOutput.push(...output);

  beforeEach(async () => {
    jest.setTimeout(60000);
    // jest.useFakeTimers();
    console.log = mockedLog;
  });

  afterEach(async () => {
    console.log = originalLog;
  });

  describe('Bucket', () => {
    describe('Create Buckets', () => {
      beforeEach(async () => {
        await createBuckets(bucketName);
      });

      afterEach(async () => {
        await Promise.all(
          getBucketNames(bucketName).map((name) => {
            return (async () => {
              await deleteBucket(name);
            })();
          }),
        );
        console.warn(consoleOutput);
        consoleOutput = [];
      });

      test('buckets successfully created', async () => {
        let buckets = await asyncListBuckets();

        const bucket1 = arrayHasMatch(
          consoleOutput,
          `S3 Bucket created at /${bucketName}-lambda.`,
        );
        const bucket2 = arrayHasMatch(
          consoleOutput,
          `S3 Bucket created at /${bucketName}-stage.`,
        );
        const bucket3 = arrayHasMatch(
          consoleOutput,
          `S3 Bucket created at /${bucketName}-builds.`,
        );
        const bucket4 = arrayHasMatch(
          consoleOutput,
          `S3 Bucket created at /${bucketName}-prod.`,
        );

        expect(bucket1).toBe(true);
        expect(bucket2).toBe(true);
        expect(bucket3).toBe(true);
        expect(bucket4).toBe(true);
      });

      test('Jade tag attached to buckets', async () => {
        const expected = { TagSet: [{ Key: 'project', Value: 'jade' }] };
        const bucket1 = await asyncGetBucketTagging({
          Bucket: `${bucketName}-lambda`,
        });
        const bucket2 = await asyncGetBucketTagging({
          Bucket: `${bucketName}-stage`,
        });
        const bucket3 = await asyncGetBucketTagging({
          Bucket: `${bucketName}-builds`,
        });
        const bucket4 = await asyncGetBucketTagging({
          Bucket: `${bucketName}-prod`,
        });

        expect(bucket1).toMatchObject(expected);
        expect(bucket2).toMatchObject(expected);
        expect(bucket3).toMatchObject(expected);
        expect(bucket4).toMatchObject(expected);
      });
      test('Bucket policies attached', async () => {
        const expected = {
          Statement: [
            {
              Sid: 'AddPerm',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject', 's3:PutObject'],
            },
          ],
        };

        const bucket1Policy = (
          await asyncGetBucketPolicy({
            Bucket: `${bucketName}-lambda`,
          })
        ).Policy;
        const bucket2Policy = (
          await asyncGetBucketPolicy({
            Bucket: `${bucketName}-stage`,
          })
        ).Policy;
        const bucket3Policy = (
          await asyncGetBucketPolicy({
            Bucket: `${bucketName}-builds`,
          })
        ).Policy;
        const bucket4Policy = (
          await asyncGetBucketPolicy({
            Bucket: `${bucketName}-prod`,
          })
        ).Policy;

        expect(JSON.parse(bucket1Policy)).toMatchObject(expected);
        expect(JSON.parse(bucket2Policy)).toMatchObject(expected);
        expect(JSON.parse(bucket3Policy)).toMatchObject(expected);
        expect(JSON.parse(bucket4Policy)).toMatchObject(expected);
      });
    });
    describe('Delete Buckets', () => {
      beforeEach(async () => {
        await createBuckets(bucketName);
      });

      test('Buckets deleted successfully', async () => {
        await Promise.all(
          getBucketNames(bucketName).map((name) => {
            return (async () => {
              await deleteBucket(name);
            })();
          }),
        );

        expect(async () => {
          await asyncHeadBucket({ Bucket: `${bucketName}-lambda` });
        }).rejects;
        expect(async () => {
          await asyncHeadBucket({ Bucket: `${bucketName}-stage` });
        }).rejects;
        expect(async () => {
          await asyncHeadBucket({ Bucket: `${bucketName}-builds` });
        }).rejects;
        expect(async () => {
          await asyncHeadBucket({ Bucket: `${bucketName}-prod` });
        }).rejects;

        console.warn(consoleOutput);
        consoleOutput = [];
      });
    });
  });
});

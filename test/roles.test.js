const {
  roleExists,
  instanceProfileExists,
  groupExists,
  createIamRole,
  deleteIamRole,
} = require('../src/aws/iam');

const {
  asyncListAttachedRolePolicies,
} = require('../src/aws/awsAsyncFunctions');

const { join, readJSONFile } = require('../src/util/fileUtils');

const roleName = 'testJadeRole';
const rolePolicies = [
  'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
];

describe('AWS IAM', () => {
  beforeEach(async () => {
    jest.setTimeout(20000);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Role', () => {
    afterEach(async () => {
      await deleteIamRole(roleName);
    });

    test('role is created', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      let role = await roleExists(roleName);
      expect(role).toBe(false);
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      const expected = { Role: { RoleName: roleName } };
      expect(role).toMatchObject(expected);
    });

    test('role is not created if it exists', async () => {
      const log = jest.spyOn(console, 'log');
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      await createIamRole(documentPolicy, roleName, rolePolicies);
      expect(log).toHaveBeenLastCalledWith(`Using existing ${roleName} role.`);
    });
    test('role policies are attached', async () => {
      let params = { RoleName: roleName };
      let expected = [
        {
          PolicyName: 'AmazonEC2FullAccess',
          PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
        },
        {
          PolicyName: 'AWSLambdaFullAccess',
          PolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
        },
      ];
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      let attachedPolicies = (await asyncListAttachedRolePolicies(params))
        .AttachedPolicies;

      expect(attachedPolicies).toMatchObject(expected);
    });
    test('deleting role does not throw error', async () => {
      const log = jest.spyOn(console, 'log');
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      await deleteIamRole(roleName);
      expect(log).toHaveBeenLastCalledWith(`${roleName} successfully deleted.`);
    });
  });

  describe('Group', () => {
    test('group is created', async () => {});
    test('group is not created if it exists', async () => {});
    test('group is deleted correctly', async () => {});
    describe('Jade user group', () => {
      test('Jade user group is created', async () => {});
      test('Jade user group has right permissions', async () => {});
    });
  });

  describe('Instance Profile', () => {
    test('instance profile is created', async () => {});
    test('instance profile is not created if it exists', async () => {});
    test('instance profile is deleted correctly', async () => {});
  });
});

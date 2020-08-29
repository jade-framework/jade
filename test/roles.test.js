const {
  roleExists,
  instanceProfileExists,
  groupExists,
  createIamRole,
  deleteIamRole,
  deleteIamGroup,
} = require('../src/aws/iam');

const { createIamGroup } = require('../src/aws/iam/createIamGroup');
const { jadeLog } = require('../src/util/logger');

const {
  asyncListAttachedRolePolicies,
} = require('../src/aws/awsAsyncFunctions');

const { join, readJSONFile } = require('../src/util/fileUtils');

const roleName = 'testJadeRole';
const rolePolicies = [
  'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
];

const groupName = 'testJadeGroup';
const groupPolicies = [
  'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
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
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      expect(role).toBeTruthy();
    });
    test('role policies are attached', async () => {
      let params = { RoleName: roleName };
      let expected = {
        AttachedPolicies: [
          {
            PolicyName: 'AmazonEC2FullAccess',
            PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
          },
          {
            PolicyName: 'AWSLambdaFullAccess',
            PolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
          },
        ],
      };
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      let attachedPolicies = await asyncListAttachedRolePolicies(params);
      expect(attachedPolicies).toMatchObject(expected);
    });
    test('deleting role does not throw error', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      await deleteIamRole(roleName);
      role = await roleExists(roleName);
      expect(role).toBe(false);
    });
  });

  describe('Group', () => {
    afterEach(async () => {
      await deleteIamGroup(groupName);
    });

    test('group is created', async () => {
      let group = await groupExists(groupName);
      expect(group).toBe(false);
      await createIamGroup(groupName, groupName);
      const expected = { Group: { GroupName: groupName } };
      group = await groupExists(groupName);
      expect(group).toMatchObject(expected);
    });
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

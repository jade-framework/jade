const {
  roleExists,
  instanceProfileExists,
  groupExists,
  createIamRole,
  deleteIamRole,
} = require('../src/aws/iam');
const { join, readJSONFile } = require('../src/util/fileUtils');

const roleName = 'testJadeRole';
const rolePolicies = [
  'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
];
const groupName = 'testJadeGroup';
const instanceProfileName = 'testJadeInsProf';

describe('AWS IAM', () => {
  beforeEach(async () => {
    jest.setTimeout(30000);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Role', () => {
    afterEach(async () => {
      await deleteIamRole(roleName);
    });

    test('return false if no role exists', async () => {
      let role = await roleExists(roleName);
      expect(role).toBe(false);
    });

    describe('when created', () => {
      let role;
      beforeEach(async () => {
        role = await createIamRole();
      });
      test('role exists', async () => {
        const documentPolicy = await readJSONFile(
          'ec2IamConfig',
          join(__dirname, '..', 'src', 'templates'),
        );
        await createIamRole(documentPolicy, roleName, rolePolicies);
        const role = await roleExists(roleName);
        const expected = { Role: { RoleName: roleName } };
        expect(role).toMatchObject(expected);
      });

      test('role is not created if it exists', async () => {});
      test('role policies are attached', async () => {});
    });

    test('policies are detached before role is deleted', async () => {});
    test('deleting role does not throw error', async () => {});
  });

  describe('Group', () => {
    test('return false if no group exists', async () => {
      let group = await groupExists(groupName);
      expect(group).toBe(false);
    });
    test('group is created', async () => {});
    test('group is not created if it exists', async () => {});
    test('group is deleted correctly', async () => {});
    describe('Jade user group', () => {
      test('Jade user group is created', async () => {});
      test('Jade user group has right permissions', async () => {});
    });
  });

  describe('Instance Profile', () => {
    test('return false if no instance profile exists', async () => {
      let profile = await instanceProfileExists(instanceProfileName);
      expect(profile).toBe(false);
    });
    test('instance profile is created', async () => {});
    test('instance profile is not created if it exists', async () => {});
    test('instance profile is deleted correctly', async () => {});
  });
});

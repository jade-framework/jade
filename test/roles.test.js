const {
  roleExists,
  instanceProfileExists,
  groupExists,
  createIamRole,
  deleteIamRole,
  deleteIamGroup,
  createInstanceProfile,
  deleteInstanceProfile,
} = require('../src/aws/iam');

const { createIamGroup } = require('../src/aws/iam/createIamGroup');
const {
  asyncListAttachedRolePolicies,
  asyncListAttachedGroupPolicies,
  asyncDeleteRole,
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

const profileName = 'test-JadeInstanceProfile';

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
      let role = await roleExists(roleName);
      expect(role).toBeTruthy();
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
    test('role is not deleted if policies are still attached', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      expect(async () => {
        await asyncDeleteRole({ RoleName: roleName });
      }).rejects;
      let role = await roleExists(roleName);
      expect(role).toBeTruthy();
    });
    test('deleting role does not throw error', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      await deleteIamRole(roleName);
      let role = await roleExists(roleName);
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
      await createIamGroup(groupName, groupPolicies);
      group = await groupExists(groupName);
      expect(group).toBeTruthy();
    });
    test('group is not created if it exists', async () => {
      await createIamGroup(groupName, groupPolicies);
      let group = await groupExists(groupName);
      expect(group).toBeTruthy();
      await createIamGroup(groupName, groupPolicies);
      group = await groupExists(groupName);
      expect(group).toBeTruthy();
    });
    test('group policies are attached', async () => {
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
          {
            PolicyName: 'CloudFrontFullAccess',
            PolicyArn: 'arn:aws:iam::aws:policy/CloudFrontFullAccess',
          },
        ],
      };

      await createIamGroup(groupName, groupPolicies);
      let attachedPolicies = await asyncListAttachedGroupPolicies({
        GroupName: groupName,
      });
      expect(attachedPolicies).toMatchObject(expected);
    });
    test('group is deleted correctly', async () => {
      await createIamGroup(groupName, groupPolicies);
      await deleteIamGroup(groupName);
      let group = await groupExists(groupName);
      expect(group).toBe(false);
    });
  });

  describe('Instance Profile', () => {
    afterEach(async () => {
      await deleteInstanceProfile(profileName, roleName);
      await deleteIamRole(roleName);
    });

    test('instance profile is created', async () => {
      let profile = await instanceProfileExists(profileName);
      expect(profile).toBe(false);
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      expect(role).toBeTruthy();
      await createInstanceProfile(profileName, roleName);
      profile = await instanceProfileExists(profileName);
      expect(profile).toBeTruthy();
    });
    test('instance profile is not created if it exists', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      await createIamRole(documentPolicy, roleName, rolePolicies);
      role = await roleExists(roleName);
      expect(role).toBeTruthy();
      await createInstanceProfile(profileName, roleName);
      profile = await instanceProfileExists(profileName);
      expect(profile).toBeTruthy();
      await createInstanceProfile(profileName, roleName);
      profile = await instanceProfileExists(profileName);
      expect(profile).toBeTruthy();
    });
    test('instance profile is deleted correctly', async () => {
      const documentPolicy = await readJSONFile(
        'ec2IamConfig',
        join(__dirname, '..', 'src', 'templates'),
      );
      let role = await roleExists(roleName);
      expect(role).toBe(false);
      await createIamRole(documentPolicy, roleName, rolePolicies);
      await createInstanceProfile(profileName, roleName);
      profile = await instanceProfileExists(profileName);
      expect(profile).toBeTruthy();
      await deleteInstanceProfile(profileName, roleName);
      profile = await instanceProfileExists(profileName);
      expect(profile).toBe(false);
    });
  });
});

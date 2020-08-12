const {
  asyncDeleteGroup,
  asyncDetachGroupPolicy,
  asyncListAttachedGroupPolicies,
  asyncRemoveUserFromGroup,
} = require('../awsAsyncFunctions');
const { jadeIamGroup } = require('../../templates/constants');
const { groupExists } = require('./exists');
const { sleep } = require('../../util/fileUtils');

const detachAllPolicies = async (groupName) => {
  try {
    const policies = (
      await asyncListAttachedGroupPolicies({
        GroupName: groupName,
      })
    ).AttachedPolicies;
    const promises = policies.map((policy) => {
      return (async () => {
        asyncDetachGroupPolicy({
          GroupName: groupName,
          PolicyArn: policy.PolicyArn,
        });
      })();
    });
    await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
};

const deleteIamGroup = async (groupName) => {
  try {
    const group = await groupExists(groupName);
    const { Users } = group;
    if (group) {
      if (Users.length > 0) {
        await removeUsersFromGroup(Users, groupName);
      }
      await detachAllPolicies(groupName);
      await sleep(10000);
      await asyncDeleteGroup({ GroupName: groupName });
    }
  } catch (err) {
    console.log(err);
  }
};

const removeUsersFromGroup = async (users, group) => {
  try {
    const promises = users.map((user) => {
      return (async () => {
        await asyncRemoveUserFromGroup({
          UserName: user.UserName,
          GroupName: group,
        });
      })();
    });
    await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
};

const deleteJadeIamGroup = async () => {
  try {
    await deleteIamGroup(jadeIamGroup);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { deleteIamGroup, deleteJadeIamGroup };

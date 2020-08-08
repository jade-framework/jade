const {
  asyncDeleteGroup,
  asyncDetachGroupPolicy,
  asyncListAttachedGroupPolicies,
} = require('../awsAsyncFunctions');
const { groupExists } = require('./exists');

const { jadeIamGroup } = require('../../templates/constants');

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
    if (group) {
      await detachAllPolicies(groupName);
      await asyncDeleteGroup({ GroupName: groupName });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteJadeIamGroup = async () => {
  try {
    await deleteIamGroup(jadeIamGroup);
  } catch (err) {
    return err;
  }
};

module.exports = { deleteIamGroup, deleteJadeIamGroup };

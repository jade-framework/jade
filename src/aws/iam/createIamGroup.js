const {
  asyncCreateGroup,
  asyncAttachGroupPolicy,
  asyncListAttachedGroupPolicies,
  asyncAddUserToGroup,
} = require('../awsAsyncFunctions');
const { jadeIamGroup } = require('../../templates/constants');
const { groupExists } = require('./exists');
const { getUserName } = require('../../util/getCredentials');
const { jadeLog, jadeErr } = require('../../util/logger');

const createGroup = async (groupName) => {
  try {
    jadeLog(`Checking if ${groupName} exists...`);
    let group = await groupExists(groupName);

    if (group) {
      jadeLog(`${groupName} already exists.`);
    } else {
      jadeLog(`${groupName} does not exist. Creating group...`);
      group = (await asyncCreateGroup({ GroupName: groupName })).Group;
      jadeLog(`${groupName} created.`);
    }
    return group;
  } catch (err) {
    jadeErr(err);
  }
};

const assignGroupPolicies = async (groupName, policies) => {
  try {
    jadeLog('Checking for existing policies...');
    const attachedPolicies = (
      await asyncListAttachedGroupPolicies({
        GroupName: groupName,
      })
    ).AttachedPolicies;
    let promises = [];
    policies.forEach((newPolicy) => {
      const isAttached = attachedPolicies.find(
        (pol) => pol.PolicyArn === newPolicy,
      );
      if (!isAttached) {
        promises.push(
          (async () =>
            await asyncAttachGroupPolicy({
              GroupName: groupName,
              PolicyArn: newPolicy,
            }))(),
        );
      }
    });
    if (promises.length > 0) {
      jadeLog(`Attaching policies to ${groupName}.`);
      await Promise.all(promises);
    }
    jadeLog('Policies attached.');
  } catch (err) {
    jadeErr(err);
  }
};

const createIamGroup = async (groupName, policies) => {
  try {
    if (await groupExists(groupName)) return true;
    await createGroup(groupName);
    await assignGroupPolicies(groupName, policies);
  } catch (err) {
    jadeErr(err);
  }
};

const addUserToGroup = async (user, group) => {
  try {
    await asyncAddUserToGroup({ UserName: user, GroupName: group });
  } catch (err) {
    jadeErr(err);
  }
};

const createJadeIamGroup = async () => {
  const requiredPolicies = [
    'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
    'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
    'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  ];
  try {
    await createIamGroup(jadeIamGroup, requiredPolicies);
  } catch (err) {
    jadeErr(err);
  }
};

const addUserToJadeGroup = async () => {
  try {
    const userName = await getUserName();
    await addUserToGroup(userName, jadeIamGroup);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createJadeIamGroup, addUserToJadeGroup };

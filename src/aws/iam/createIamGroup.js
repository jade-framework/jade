const {
  asyncCreateGroup,
  asyncAttachGroupPolicy,
  asyncListAttachedGroupPolicies,
} = require('../awsAsyncFunctions');
const { groupExists } = require('./exists');
const { jadeIamGroup } = require('../../templates/constants');

const createGroup = async (groupName) => {
  try {
    console.log(`Checking if ${groupName} exists...`);
    let group = await groupExists(groupName);

    if (group) {
      console.log(`${groupName} already exists.`);
    } else {
      console.log(`${groupName} does not exist. Creating group...`);
      group = (await asyncCreateGroup({ GroupName: groupName })).Group;
      console.log(`${groupName} created.`);
    }
    return group;
  } catch (err) {
    console.log(err);
  }
};

const assignGroupPolicies = async (groupName, policies) => {
  try {
    console.log('Checking for existing policies...');
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
      console.log(`Attaching policies to ${groupName}.`);
      await Promise.all(promises);
    }
    console.log('Policies attached.');
  } catch (err) {
    console.log(err);
  }
};

const createIamGroup = async (groupName, policies) => {
  try {
    await createGroup(groupName);
    await assignGroupPolicies(groupName, policies);
  } catch (err) {
    console.log(err);
  }
};

const createJadeIamGroup = async () => {
  const requiredPolicies = [
    'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
    'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
    'arn:aws:iam::aws:policy/CloudFrontFullAccess',
    'arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator',
  ];
  try {
    await createIamGroup(jadeIamGroup, requiredPolicies);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createIamGroup, createJadeIamGroup };

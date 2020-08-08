const { jadeIamGroup } = require('../../templates/constants');
const { getUserName } = require('../../util/getCredentials');
const { asyncAddUserToGroup } = require('../awsAsyncFunctions');

const addUserToJadeGroup = async () => {
  try {
    const userName = await getUserName();
    await asyncAddUserToGroup({ GroupName: jadeIamGroup, UserName: userName });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addUserToJadeGroup };

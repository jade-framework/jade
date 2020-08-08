const AWS = require('aws-sdk/global');
const config = new AWS.Config();
const { asyncGetCallerIdentity } = require('../aws/awsAsyncFunctions');
const credentials = config.credentials;

const getUserName = async () => {
  try {
    let callerIdentity = await asyncGetCallerIdentity();
    userName = callerIdentity.Arn.split('user/')[1];
    return userName;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { credentials, getUserName };

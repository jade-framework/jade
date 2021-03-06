const AWS = require('aws-sdk/global');
const { asyncGetCallerIdentity } = require('../aws/awsAsyncFunctions');
const config = new AWS.Config();
const credentials = config.credentials;
const { jadeErr } = require('./logger');

const getUserName = async () => {
  try {
    const callerIdentity = await asyncGetCallerIdentity();
    userName = callerIdentity.Arn.split('user/')[1];
    return userName;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { credentials, getUserName };

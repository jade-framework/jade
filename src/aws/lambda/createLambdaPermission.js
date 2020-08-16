const { asyncAddPermission } = require('../awsAsyncFunctions');
const { jadeLog, jadeErr } = require('../../util/logger');

const createLambdaPermission = async (params) => {
  try {
    await asyncAddPermission(params);
    jadeLog('Successfully added lambda permission.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createLambdaPermission };

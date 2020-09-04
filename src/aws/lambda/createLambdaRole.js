const { join } = require('path');
const { createIamRole } = require('../iam/createIamRole');
const { readJSONFile } = require('../../util/fileUtils');
const {
  lambdaIamRoleName,
  lambdaRolePolicies,
} = require('../../templates/constants');
const { jadeErr } = require('../../util/logger');

const createLambdaRole = async () => {
  try {
    const lambdaDocumentPolicy = await readJSONFile(
      'lambdaIamConfig',
      join(__dirname, '..', '..', 'templates'),
    );
    const lambdaRoleResponse = await createIamRole(
      lambdaDocumentPolicy,
      lambdaIamRoleName,
      lambdaRolePolicies,
    );
    return lambdaRoleResponse;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createLambdaRole };

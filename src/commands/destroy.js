const { writeConfig, readConfig } = require('../util/fileUtils');
const { jadeErr, jadeWarn, jadeLog } = require('../util/logger');
const { confirmDestroy } = require('../util/questions');
const { deleteAllBuckets } = require('../aws/s3/deleteAllBuckets');
const { deleteJadeIamRoles } = require('../aws/iam/deleteIamRole');
const { deleteJadeIamGroup } = require('../aws/iam/deleteIamGroup');

const destroy = async () => {
  try {
    const answer = await confirmDestroy();
    if (!answer) return false;

    deleteAllBuckets();
    deleteJadeIamGroup();
    deleteJadeIamRoles();
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { destroy };

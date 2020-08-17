const { jadeErr, jadeLog } = require('../util/logger');
const { confirmDestroy } = require('../util/questions');
const { resetJade } = require('../util/reset/resetJade');
const { deleteAllApps } = require('../util/deleteApps');

const destroy = async () => {
  try {
    const answer = await confirmDestroy();
    if (!answer) return false;

    await deleteAllApps();
    await resetJade();
    jadeLog('All AWS infrastructure has now been removed.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { destroy };

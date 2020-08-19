const { jadeErr, jadeLog } = require('../util/logger');
const { confirmDestroy } = require('../util/questions');
const { resetJade, hardResetJade } = require('../util/reset/resetJade');
const { deleteAllApps } = require('../util/deleteApps');

const destroy = async () => {
  try {
    const { destroy, sync } = await confirmDestroy();
    if (!destroy) return false;

    await deleteAllApps(sync);
    if (sync) {
      await hardResetJade();
    } else {
      await resetJade();
    }
    jadeLog('All AWS infrastructure has now been removed.');
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { destroy };

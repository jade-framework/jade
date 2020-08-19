const { appNotFound } = require('../util/messages');
const { unfreezeApp } = require('../util/freezeApps');

const unfreeze = async ([appName, ..._]) => {
  if (!appName) return appNotFound();
  try {
    await unfreezeApp(appName);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { unfreeze };

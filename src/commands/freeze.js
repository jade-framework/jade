const { appNotFound } = require('../util/messages');
const { jadeErr } = require('../util/logger');
const { freezeApp } = require('../util/freezeApps');

const freeze = async ([appName, ..._]) => {
  if (!appName) return appNotFound();
  try {
    await freezeApp(appName);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { freeze };

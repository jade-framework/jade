const { deleteOneApp } = require('../util/deleteApps');
const { appNotFound } = require('../util/helpers');
const { jadeErr } = require('../util/logger');

const deleteApp = async (args) => {
  const appName = args[0];
  if (!appName) return appNotFound();
  try {
    await deleteOneApp(appName);
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { deleteApp };

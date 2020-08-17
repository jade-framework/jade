const { appNotFound } = require('../util/helpers');

const unfreeze = async (args) => {
  const appName = args[0];
  if (!appName) return appNotFound();
  const params = {
    TableName: appsTableName,
  };
  // try {
  //   const apps = await asyncDynamoScan(params);
  //   const items = apps.Items;
  //   if (apps.Items.length > 0) {
  //     const match = items.find(
  //       (item) => item.projectName.S.trim() === appName.trim(),
  //     );
  //     if (match && match.isActive.BOOL) {
  //       const confirm = await confirmDelete();
  //       if (confirm) await removeApp(match);
  //     } else {
  //       return appNotFound();
  //     }
  //   } else {
  //     return appNotFound();
  //   }
  // } catch (err) {
  //   jadeErr(err);
  // }
};

module.exports = { unfreeze };

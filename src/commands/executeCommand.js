const { init } = require('./init');
const { add } = require('./add');
const { admin } = require('./admin');
const { deleteApp } = require('./delete');
const { destroy } = require('./destroy');
const { list } = require('./list');
const { freeze } = require('./freeze');
const { unfreeze } = require('./unfreeze');
const { help } = require('./help');
const { jadeLog, jadeErr } = require('../util/logger');

const commandIsBlank = (cmd) => cmd === undefined || cmd === '';
const commandIsHelp = (cmd) => cmd === 'help' || cmd === '-h' || cmd === 'man';

const executeCommand = async (command, args, homedir) => {
  try {
    if (command === 'init') {
      await init(homedir, args);
    } else if (command === 'add') {
      await add(homedir, args);
    } else if (command === 'admin') {
      await admin();
    } else if (command === 'delete') {
      await deleteApp(args);
    } else if (command === 'destroy') {
      await destroy(homedir);
    } else if (command === 'list') {
      await list();
    } else if (command === 'freeze') {
      await freeze(args);
    } else if (command === 'unfreeze') {
      await unfreeze(args);
    } else if (commandIsHelp(command) || commandIsBlank(command)) {
      await help();
    } else {
      jadeLog(`Command ${command} is not valid.`);
    }
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { executeCommand };

// if (command === 'create') {
//   await create(resourceName, options);
// } else if (command === 'deploy') {
//   await deploy(resourceName, homedir, options);
// } else if (command === 'redeploy') {
//   await redeploy(resourceName, homedir, options);
// } else if (command === 'get') {
//   await get(resourceName);
// } else if (command === 'delete') {
//   await destroy(resourceName, homedir, options);
// } else if (command === 'dbtable') {
//   await dbtable(resourceName, homedir);
// } else if (command === 'list')

// assuming no user Lambda
// first time:
// - Jade setup: EC2, Lambda, DDB, S3, CF
// - DDB --> Lambda (build info) --> EC2
// - app setup: build, deploy (and stage) files

// jade add
// second time (user wants another website)
// - DDB --> Lambda (build info) --> EC2
//   - is Git branch "master" or "staging"
//   - EC2 pushes to master bucket or staging bucket
// - build and deploy files + see them on CF

// webhook --> Api Gateway --> Lambda --> DDB + EC2

// build info: gitUrl, bucketName, master/staging
// jade destroy
// - type your puppy's name here to confirm destruction
// - delete EC2
// jade delete <projectName: DDB>
// - simple reset for one project name
// - don't delete EC2 instances
// - underlying method: reset

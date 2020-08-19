const { jadeLog } = require('../util/logger');

const help = async () => {
  jadeLog('Welcome to Jade!');
  jadeLog(
    'To get started, run "jade init". This will ask for your GitHub repo and other commands to initialize the AWS services for your Jade app.',
  );
  jadeLog(
    'Jade apps are JAMstack ready: hosted on a CDN, your users will be able to download your entire website quickly and securely.',
  );
  jadeLog('For more information, please visit: https://jamstack.org.');
};

module.exports = { help };

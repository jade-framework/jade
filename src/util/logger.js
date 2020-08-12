const errorEmoji = '⚠️';
const { jadePrefix } = require('../templates/constants');

const escape = '\x1b';
const reset = '\x1b[0m';
const red = '[31m';
const yellow = '[33m';

const jadeErr = (text) => {
  console.log(`${errorEmoji} ${escape}${red}`, text, reset);
};

const jadeWarn = (text) => {
  console.log(`${jadePrefix} ${escape}${yellow}`, text, reset);
};

const jadeLog = (text) => {
  console.log(jadePrefix, text);
};

module.exports = {
  jadeErr,
  jadeWarn,
  jadeLog,
};

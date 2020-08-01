const errorEmoji = "⚠️";

const jadeErr = (text) => {
  console.log(errorEmoji.concat(` ${text}`));
};

const jadeWarn = (text) => {
  const escape = "\x1b";
  const yellow = "[33m";
  const reset = "\x1b[0m";
  console.log(`${escape}${yellow}${text}${reset}`);
};

module.exports = {
  jadeErr,
  jadeWarn,
};

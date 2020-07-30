const errorEmoji = "⚠️";

const jadeErr = (text) => {
  console.log(errorEmoji.concat(` ${text}`));
};

module.exports = {
  jadeErr,
};

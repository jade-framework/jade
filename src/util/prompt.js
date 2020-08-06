const inquirer = require("inquirer");
const promptModule = inquirer.createPromptModule();
const { jadePrefix } = require("../templates/constants");

const prompt = async (questions) => {
  const q = questions.map((val) => {
    return { ...val, prefix: jadePrefix };
  });
  return promptModule(q);
};

module.exports = { prompt };

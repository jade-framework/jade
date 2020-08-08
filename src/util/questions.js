const { prompt } = require('./prompt');
const { promptProjectName, promptGitUrl } = require('./validations');
const { gitRepos } = require('../templates/constants');

// questions used for jade init
const initialQuestions = async (config) => {
  const questions = [
    {
      message: 'What is your project name?\n',
      name: 'projectName',
      default: config.projectName || 'My Jade Project',
      validate: (input) => {
        return promptProjectName(input);
      },
    },
    {
      type: 'list',
      message: "What's your favorite Git collaboration tool?\n",
      name: 'gitProvider',
      choices: gitRepos,
      default: config.gitProvider || 'GitHub',
    },
    {
      type: 'confirm',
      message: (answers) => {
        return `Do you currently have a ${answers.gitProvider} repo?\n`;
      },
      name: 'gitExists',
      default: true,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const gitQuestions = async (initialAns) => {
  const questions = [
    {
      name: 'gitUrl',
      message: `Please enter your ${initialAns.gitProvider} URL here. Note that Jade will use the root folder for deployment (https://github.com/user/root):\n`,
      validate: (input) => {
        return promptGitUrl(input);
      },
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const noGitAlert = async () => {
  await prompt([
    {
      name: 'noGit',
      message: `Thank you for using Jade. To continue, please setup a Git repository with one of these providers: ${gitRepos.join(
        ' | ',
      )}\n\x1b[30;0mPress enter to continue...`,
    },
  ]);
};

const confirmResponses = async ({ projectName, gitUrl }) => {
  const message = `Your project name is: | ${projectName} |\nYour Git URL is: | ${gitUrl} |\nIs this correct?`;
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
    },
  ]);
  return answer;
};

// questions used for jade add
const addAppQuestions = async () => {};

module.exports = {
  initialQuestions,
  gitQuestions,
  noGitAlert,
  confirmResponses,
  addAppQuestions,
};

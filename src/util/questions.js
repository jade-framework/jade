const { prompt } = require('./prompt');
const { promptProjectName, promptGitUrl } = require('./validations');
const { gitRepos } = require('../templates/constants');

// questions used for jade init
const initialInitQuestions = async () => {
  const questions = [
    {
      message: 'What is your project name?\n',
      name: 'projectName',
      default: 'My Jade Project',
      validate: (input) => {
        return promptProjectName(input);
      },
    },
    {
      type: 'list',
      message: "What's your favorite Git collaboration tool?\n",
      name: 'gitProvider',
      choices: gitRepos,
      default: 'GitHub',
    },
    {
      type: 'confirm',
      message: (answers) => {
        return `Do you currently have a public ${answers.gitProvider} repo?\n`;
      },
      name: 'gitExists',
      default: true,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

// questions used for jade add
const initialAddQuestions = async () => {
  const questions = [
    {
      name: 'projectName',
      message: 'What is your new project name?\n',
      default: 'My New Jade Project',
      validate: (input) => {
        return promptProjectName(input);
      },
    },
    {
      type: 'list',
      message: 'What Git collaboration tool will you be using?\n',
      name: 'gitProvider',
      choices: gitRepos,
      default: 'GitHub',
    },
    {
      type: 'confirm',
      message: (answers) => {
        return `Do you currently have a public ${answers.gitProvider} repo?\n`;
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

const confirmResponses = async ({ projectName, gitUrl }) => {
  const message = `Your project name is: | ${projectName} |\nYour Git URL is: | ${gitUrl} |\nIs this correct?`;
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
    },
  ]);
  return answer.confirmed;
};

// questions used to handle key pairs
const confirmOverwriteKeyPair = async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'overwrite',
      message:
        'You currently have a key pair. Would you like to create a new one?',
    },
  ];
  const answers = await prompt(questions);
  return answers.overwrite;
};

const confirmDeleteKeyPair = async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'delete',
      message:
        'Jade cannot find a ".jade" folder in the current directory with the Jade private key. Would you like to make a new key pair (note: this will prevent you from accessing the old EC2 instance)?',
    },
  ];
  const answers = await prompt(questions);
  return answers.delete;
};

const confirmDestroy = async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'destroy',
      message:
        'Are you sure? This will remove all apps deployed with Jade and their provisioned resources from AWS.',
    },
  ];
  const answers = await prompt(questions);
  return answers.destroy;
};

module.exports = {
  initialInitQuestions,
  gitQuestions,
  confirmResponses,
  initialAddQuestions,
  confirmOverwriteKeyPair,
  confirmDeleteKeyPair,
  confirmDestroy,
};

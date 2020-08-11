const { prompt } = require('./prompt');
const { promptProjectName, promptGitUrl } = require('./validations');

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
      type: 'confirm',
      message: `Do you currently have a public GitHub repo?\n`,
      name: 'gitExists',
      default: true,
    },
  ];

  const answers = await prompt(questions);
  return answers;
};

const appConfigQuestions = async () => {
  const questions = [
    {
      name: 'gitUrl',
      message: `Please enter your GitHub URL here. Note that Jade will use the root folder for deployment (https://github.com/user/root):\n`,
      validate: (input) => {
        return promptGitUrl(input);
      },
    },
    {
      name: 'configNeeded',
      message: `We'd now like to know your basic build settings. For more information, please visit https://github.com/jade-framework/jade.`,
    },
    {
      name: 'userInstallationCommands',
      message: `Please enter the command to install your project's environment. This will be run once in your EC2 instance to include the right packages for your app (ex. "yarn install"):\n`,
      default: `yarn install`,
    },
    {
      name: 'userBuildCommand',
      message: `Please enter the command to build your project files. This will be run each time a commit is made to your GitHub repo, (ex. "yarn build"):\n`,
      default: `yarn build`,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const confirmResponses = async ({ projectName, gitUrl }) => {
  const message = `Your project name is: >>> ${projectName}\nYour Git URL is: >>> ${gitUrl}\nIs this correct?`;
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

module.exports = {
  initialInitQuestions,
  appConfigQuestions,
  confirmResponses,
  initialAddQuestions,
  confirmOverwriteKeyPair,
  confirmDeleteKeyPair,
};

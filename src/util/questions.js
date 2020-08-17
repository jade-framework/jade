const { prompt } = require('./prompt');
const { promptProjectName, promptGitUrl } = require('./validations');
const { jadePrefix } = require('../templates/constants');

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
      message: `Do you currently have a public GitHub repo?\n`,
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
      message: `Please enter your public GitHub repo's URL here. Note that Jade will use the "root" folder for deployment (https://github.com/user/root):\n`,
      validate: (input) => {
        return promptGitUrl(input);
      },
      filter: (input) => {
        return input.replace(/\s/gi, '');
      },
    },
    {
      name: 'userInstallCommand',
      message: `Please enter the command to install your project's environment:\n`,
      default: `yarn install`,
    },
    {
      name: 'userBuildCommand',
      message: `Please enter the command to build your project files:\n`,
      default: `yarn build`,
    },
    {
      name: 'publishDirectory',
      message: `Please specify the publish directory. Jade will take files in this directory and deploy them to the CDN:\n`,
      default: `public\/`,
    },
  ];
  const answers = await prompt(questions);
  return answers;
};

const confirmResponses = async (projectData) => {
  const {
    projectName,
    gitUrl,
    userInstallCommand,
    userBuildCommand,
    publishDirectory,
  } = projectData;

  const message = [
    'Your project details are:',
    `Project name          >>>  ${projectName}`,
    `Git URL               >>>  ${gitUrl}`,
    `Installation command  >>>  ${userInstallCommand}`,
    `Build command         >>>  ${userBuildCommand}`,
    `Publish directory     >>>  ${publishDirectory}`,
    'Is this correct?',
  ];

  const answer = await prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: message.join(`\n${jadePrefix} `),
    },
  ]);
  return answer.confirmed;
};

// questions used to handle key pairs
const confirmDeleteKeyPair = async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'delete',
      message:
        'Jade cannot find a ".jade" folder in the current directory with the Jade private key. Would you like to make a new key pair (note: this will prevent you from accessing existing EC2 instances)?',
    },
  ];
  const answers = await prompt(questions);
  return answers.delete;
};

const confirmDelete = async () => {
  const questions = [
    {
      type: 'confirm',
      name: 'delete',
      message:
        'Are you sure? This will remove the app and its associated AWS infrastructure (including CloudFront, EC2, and S3). This action will not affect other Jade apps.',
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
  appConfigQuestions,
  confirmResponses,
  initialAddQuestions,
  confirmDeleteKeyPair,
  confirmDelete,
  confirmDestroy,
};

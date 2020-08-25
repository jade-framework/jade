const chalk = require('chalk');
const { prompt } = require('./prompt');
const { promptProjectName, promptGitUrl } = require('./validations');
const { jadePrefix } = require('../templates/constants');

// questions used for jade init
const initialInitQuestions = async (args) => {
  const questions = [
    {
      message: 'What is your project name?\n',
      name: 'projectName',
      default: args[0] || 'My Jade Project',
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
const initialAddQuestions = async (args) => {
  const questions = [
    {
      name: 'projectName',
      message: `What is your new ${chalk.green('project name')}?\n`,
      default: args[0] || 'My New Jade Project',
      validate: (input) => {
        return promptProjectName(input);
      },
    },
    {
      type: 'confirm',
      message: `Do you currently have a ${chalk.green(
        'public GitHub repo',
      )}?\n`,
      name: 'gitExists',
      default: true,
    },
  ];

  const answers = await prompt(questions);
  return answers;
};

const appConfigQuestions = async (args) => {
  const [_, userGitUrl, userInstall, userBuild, userPublish] = args;
  const questions = [
    {
      name: 'gitUrl',
      message: `Please enter ${chalk.green(
        "your public GitHub repo's URL",
      )} here. Note that Jade will use the "root" folder for deployment (https://github.com/user/root):\n`,
      validate: (input) => {
        return promptGitUrl(input);
      },
      filter: (input) => {
        return input.replace(/\s/gi, '');
      },
      default: userGitUrl || 'https://github.com/user/root',
    },
    {
      name: 'userInstallCommand',
      message: `Please enter the ${chalk.green(
        'command to install',
      )} your project's environment:\n`,
      default: userInstall || `yarn install`,
    },
    {
      name: 'userBuildCommand',
      message: `Please enter the ${chalk.green(
        'command to build',
      )} your project files:\n`,
      default: userBuild || `yarn build`,
    },
    {
      name: 'publishDirectory',
      message: `Please specify the ${chalk.green(
        'publish directory',
      )}. Jade will take files in this directory and deploy them to the CDN:\n`,
      default: userPublish || `public\/`,
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

  const arrow = chalk.green('->');

  const message = [
    `Your ${chalk.green('project details')} are:`,
    `Project name          ${arrow}  ${projectName}`,
    `Git URL               ${arrow}  ${gitUrl}`,
    `Installation command  ${arrow}  ${userInstallCommand}`,
    `Build command         ${arrow}  ${userBuildCommand}`,
    `Publish directory     ${arrow}  ${publishDirectory}`,
    'Is this correct?\n',
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
        'Jade cannot find a ".jade" folder in the current directory with the Jade private key. Would you like to make a new key pair (note: this will prevent you from accessing existing EC2 instances)?\n',
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
        'Are you sure? This will remove the app and its associated AWS infrastructure (including CloudFront, EC2, and S3). This action will not affect other Jade apps.\n',
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
        'Are you sure? This will remove all apps deployed with Jade and their provisioned resources from AWS.\n',
    },
    {
      type: 'confirm',
      name: 'sync',
      message:
        'Would you like to wait for Jade to remove all apps? This may take up to 90 minutes. Otherwise, you will have to manually remove the Jade IAM roles from your AWS account. For more info, please visit: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html\n',
      when: ({ destroy }) => destroy,
    },
  ];
  const answers = await prompt(questions);
  return answers;
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

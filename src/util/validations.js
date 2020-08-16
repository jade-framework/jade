const { credentials } = require('./getCredentials');
const { exists, readFile, getJadePath } = require('./fileUtils');
const { getGitFolder } = require('./helpers');
const { projectNameLength } = require('../templates/constants');
const { groupExists, deleteIamGroup } = require('../aws/iam');
const { jadeErr } = require('./logger');

const {
  asyncGetCallerIdentity,
  asyncCreateGroup,
  asyncHeadBucket,
  asyncGetRole,
  asyncGetFunction,
  asyncListBuckets,
  asyncDynamoListTables,
} = require('../aws/awsAsyncFunctions');

const cwd = process.cwd();

// Command argument provided
const commandArgProvided = ({ projectName }) => {
  if (projectName && projectName.trim()) {
    return true;
  } else {
    return false;
  }
};

// AWS Credentials helper methods
const awsCredentialsConfigured = () => {
  if (credentials) {
    return true;
  } else {
    return false;
  }
};

const isValidAwsCredentials = async () => {
  try {
    await asyncGetCallerIdentity();
    return true;
  } catch (err) {
    return false;
  }
};

// S3 Bucket helper methods
const isValidBucketName = (name) => {
  const regex = /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/;

  if (!regex.test(name)) {
    return false;
  } else {
    return true;
  }
};

const isBucketNameAvailable = async (name) => {
  const params = { Bucket: name };

  try {
    await asyncHeadBucket(params);
    return false;
  } catch (error) {
    return true;
  }
};

const bucketExistsWithUser = async (name) => {
  try {
    const data = await asyncListBuckets();
    const buckets = data.Buckets;
    for (let i = 0; i < buckets.length; i += 1) {
      if (buckets[i].Name === name) {
        return true;
      }
    }
    return false;
  } catch (err) {
    jadeErr(err);
  }
};

// Lambda helper methods
const isValidLambdaName = (name) => {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;

  if (!regex.test(name)) {
    return false;
  } else {
    return true;
  }
};

const lambdaExistsInCwd = async (name) => {
  const lambdaFileExists = await exists(`${cwd}/src/aws/lambda/${name}.js`);
  return lambdaFileExists;
};

const lambdaExistsOnAws = async (name) => {
  const params = { FunctionName: name };

  try {
    await asyncGetFunction(params);
    return true;
  } catch (error) {
    return false;
  }
};

const isValidLambda = async (name) => {
  const path = `${cwd}/src/aws/lambda/${name}.js`;
  const lambdaFile = await readFile(path);
  return lambdaFile.includes('exports.handler');
};

// Resource helper methods
const roleExistsOnAws = async (name) => {
  const params = { RoleName: name };

  try {
    await asyncGetRole(params);
    return true;
  } catch (error) {
    return false;
  }
};

// Lambda validations
const validateLambdaCreation = async (name) => {
  const validations = [
    {
      validation: lambdaExistsInCwd,
      invalidBoolean: true,
      invalidMessage: `Name "${name}" is already being used in this directory`,
    },
    {
      validation: isValidLambdaName,
      invalidBoolean: false,
      invalidMessage: `Name "${name}" is invalid. It must be between 1 and 64 characters long. It may only contain letters, numbers, hyphens(-), or underscores(_)`,
    },
  ];

  const status = await validateResource(name, validations);

  return status;
};

const validateLambdaDeployment = async (name) => {
  const validations = [
    {
      validation: isValidLambdaName,
      invalidBoolean: false,
      invalidMessage: `Name "${name}" is invalid. It must be between 1 and 64 characters long. It may only contain letters, numbers, hyphens(-), or underscores(_)`,
    },
    {
      validation: lambdaExistsInCwd,
      invalidBoolean: false,
      invalidMessage: `File "${name}" does not exist in this directory`,
    },
    {
      validation: lambdaExistsOnAws,
      invalidBoolean: true,
      invalidMessage: `Lambda "${name}" already exists on AWS`,
    },
    {
      validation: isValidLambda,
      invalidBoolean: false,
      invalidMessage: `Lambda "${name}" does not contain exports.handler`,
    },
  ];
  const status = await validateResource(name, validations);
  return status;
};

const validateLambdaDeletion = async (name) => {
  const validations = [
    {
      validation: lambdaExistsOnAws,
      invalidBoolean: false,
      invalidMessage: `Lambda "${name}" does not exist on AWS`,
    },
  ];
  const status = await validateResource(name, validations);
  return status;
};

// Role validations
const validateRoleAssumption = async (name) => {
  const validations = [
    {
      validation: roleExistsOnAws,
      invalidBoolean: false,
      invalidMessage: `Role "${name}" does not exist`,
    },
  ];
  const status = await validateResource(name, validations);
  return status;
};

// S3 bucket validations
const validateBucketCreation = async (name) => {
  const validations = [
    {
      validation: isBucketNameAvailable,
      invalidBoolean: false,
      invalidMessage: `Bucket name "${name}" already exists`,
    },
    {
      validation: isValidBucketName,
      invalidBoolean: false,
      invalidMessage: `Bucket name "${name}" is invalid. It must be between 3 and 63 characters long. It may only contain lowercase letters, numbers, dots(.), or hyphens(-). To see the full rules for bucket naming visit: https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html`,
    },
  ];

  const status = await validateResource(name, validations);

  return status;
};

const validateBucketUpload = async (name) => {
  const validations = [
    {
      validation: bucketExistsWithUser,
      invalidBoolean: false,
      invalidMessage: `Bucket name "${name}" does not exist within list of user buckets`,
    },
  ];

  const status = await validateResource(name, validations);

  return status;
};

const validateProjectName = ({ projectName }) => {
  return projectName.length > 0 && projectName.length <= projectNameLength;
};

const promptProjectName = (projectName) => {
  let valid = validateProjectName({ projectName });
  if (!valid) {
    valid = `Your project name needs to be between 1 and ${projectNameLength} characters.`;
  }
  return valid;
};

// change to take config as input and remove awaits
const validateUniqueProjectName = async ({ projectName, config }) => {
  return (
    config.filter((project) => project.projectName === projectName).length === 0
  );
};

const validateGitExists = ({ gitExists }) => gitExists;

const validateInitialInput = async (input) => {
  const { projectName } = input;
  const validations = [
    {
      validation: validateProjectName,
      invalidBoolean: false,
      invalidMessage: `Project name "${projectName}" is invalid. Please make sure it is between 1 and ${projectNameLength} characters.`,
    },
    {
      validation: validateUniqueProjectName,
      invalidBoolean: false,
      invalidMessage: `Project name "${projectName}" has already been used. Please key in a different project name.`,
    },
    {
      validation: validateGitExists,
      invalidBoolean: false,
      invalidMessage: `Thank you for using Jade. To continue, please setup a public GitHub repository.`,
    },
  ];

  const status = await validateResource(input, validations);

  return status;
};

const validateGitUrl = ({ gitUrl }) => {
  return /(http(s)?)(:(\/\/))(www\.)?(github.com)([\w\.@\:/\-~]+)(\.git)?(\/)?/.test(
    gitUrl,
  );
};

const promptGitUrl = (gitUrl) => {
  let valid = validateGitUrl({ gitUrl });
  if (!valid) {
    valid = `The url should be in the form "https://github.com/user/root".`;
  }
  return valid;
};

const validateUniqueGitUrl = ({ gitUrl, config }) => {
  return (
    config.filter((project) => {
      const projectUrl = project.gitUrl;
      return projectUrl.includes(gitUrl) || gitUrl.includes(projectUrl);
    }).length === 0
  );
};

const validateUniqueGitFolder = ({ gitUrl, config }) => {
  const folder = getGitFolder(gitUrl);
  return (
    config.filter((project) => getGitFolder(project.gitUrl) === folder)
      .length === 0
  );
};

const validateGitInput = async (input) => {
  const { gitUrl } = input;
  const validations = [
    {
      validation: validateGitUrl,
      invalidBoolean: false,
      invalidMessage: `Please enter a valid public Git repo.`,
    },
    {
      validation: validateUniqueGitUrl,
      invalidBoolean: false,
      invalidMessage: `Project Git URL "${gitUrl}" has already been used. Please use a different Git URL.`,
    },
    {
      validation: validateUniqueGitFolder,
      invalidBoolean: false,
      invalidMessage: `You already have a project that uses the folder name ${getGitFolder(
        gitUrl,
      )}. Please change the folder name of your repo.`,
    },
  ];

  const status = await validateResource(input, validations);

  return status;
};

// Validate User Permissions
const hasIamPermission = async () => {
  try {
    const testGroup = 'testGroup';
    const group = await groupExists(testGroup);

    if (!group) {
      await asyncCreateGroup({ GroupName: testGroup });
    }
    await deleteIamGroup(testGroup);

    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const validateUserPermissions = async () => {
  const validations = [
    {
      validation: awsCredentialsConfigured,
      invalidBoolean: false,
      invalidMessage:
        'CredentialsError: Could not load credentials from any providers. For instructions, please visit: https://awscli.amazonaws.com/v2/documentation/api/latest/topic/config-vars.html',
    },
    {
      validation: isValidAwsCredentials,
      invalidBoolean: false,
      invalidMessage: `Credentials are invalid. Please configure the correct AWS Credentials.`,
    },
    {
      validation: hasIamPermission,
      invalidBoolean: false,
      invalidMessage: `User requires read/write IAM permissions to create the Jade IAM Group. Please add policy "IAMFullAccess" to your User account. For instructions, please visit: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html`,
    },
  ];

  const status = await validateResource(null, validations);

  return status;
};

// Validate delete command argument
const validateDeleteArg = async (input) => {
  const { projectName } = input;
  const validations = [
    {
      validation: commandArgProvided,
      invalidBoolean: false,
      invalidMessage:
        'Argument is missing. Please re-run the command in the following format: jade delete <appName>.',
    },
    {
      validation: validateUniqueProjectName, //check if app exists in config
      invalidBoolean: true,
      invalidMessage: `App "${projectName}" does not exist or was not deployed using Jade.`,
    },
  ];

  const status = await validateResource(input, validations);

  return status;
};

// validate Jade directory and AWS services exist
const jadePathExists = async (directory) => {
  const jadePath = getJadePath(directory);
  try {
    return await exists(jadePath);
  } catch (err) {
    return false;
  }
};

const dynamoExists = async () => {
  try {
    const tables = await asyncDynamoListTables({});
    return tables.TableNames.length > 0;
  } catch (err) {
    return false;
  }
};

const validateAwsIsSetup = async (directory) => {
  const validations = [
    {
      validation: dynamoExists,
      invalidBoolean: false,
      invalidMessage: `Your account does not have AWS services setup. Please run "jade init" to continue.`,
    },
    {
      validation: jadePathExists,
      invalidBoolean: false,
      invalidMessage: `Your directory is not setup, please run "jade init" to initialize the Jade directory or change directory to where the ".jade" folder is located.`,
    },
  ];

  const status = await validateResource(directory, validations);

  return status;
};

const validateAwsIsNotSetup = async (directory) => {
  const validations = [
    {
      validation: dynamoExists,
      invalidBoolean: true,
      invalidMessage: `Your account already has AWS setup. Please run "jade add" in the same directory as before to add a new app.`,
    },
  ];

  const status = await validateResource(directory, validations);

  return status;
};

// Validations helper method
const validateResource = async (resourceData, validations) => {
  let msg;

  for (let i = 0; i < validations.length; i++) {
    const { validation, invalidBoolean, invalidMessage } = validations[i];
    const result = await validation(resourceData);

    if (result === invalidBoolean) {
      msg = invalidMessage;
      break;
    }
  }
  return msg;
};

module.exports = {
  awsCredentialsConfigured,
  validateLambdaCreation,
  validateBucketCreation,
  validateRoleAssumption,
  validateLambdaDeployment,
  validateLambdaDeletion,
  validateBucketUpload,
  validateInitialInput,
  validateGitInput,
  promptProjectName,
  promptGitUrl,
  validateUserPermissions,
  validateDeleteArg,
  validateAwsIsSetup,
  validateAwsIsNotSetup,
};

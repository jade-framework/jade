const { credentials, getUserName } = require('./getCredentials');
const { jadeErr } = require('./logger.js');
const { exists, readFile } = require('./fileUtils');

const {
  asyncGetCallerIdentity,
  asyncListAttachedUserPolicy,
} = require('../aws/awsAsyncFunctions');

const {
  asyncHeadBucket,
  asyncGetRole,
  asyncGetFunction,
  asyncListBuckets,
} = require('../aws/awsAsyncFunctions');

const cwd = process.cwd();

// AWS Credentials helper methods
const awsCredentialsConfigured = () => {
  console.log('Looking for AWS Credentials...');

  if (credentials) {
    console.log('Access Key:', credentials.accessKeyId);
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
    console.log(err);
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

const hasRequiredPermissions = async () => {
  const requiredPolicies = [
    'AmazonEC2FullAccess',
    'AWSLambdaFullAccess',
    'CloudFrontFullAccess',
    'AmazonAPIGatewayAdministrator',
  ];

  try {
    // grab user Policies
    const userName = await getUserName();
    const data = await asyncListAttachedUserPolicy({
      UserName: userName,
    });
    const currentUserPolicies = data.AttachedPolicies;

    // check if user has Administrator Access permission
    if (
      currentUserPolicies.find((policy) => {
        return policy.PolicyName === 'AdministratorAccess';
      })
    ) {
      return true;
    }

    // check user has all the required Policies
    for (let i = 0; i < requiredPolicies.length; i += 1) {
      let policy = currentUserPolicies.find((policy) => {
        return policy.PolicyName === requiredPolicies[i];
      });
      if (!policy) return false;
    }

    return true;
  } catch (err) {
    console.log(err);
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

// Validate user input
const projectNameLength = 31;

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

const validateGitUrl = ({ gitUrl }) => {
  return /(http(s)?)(:(\/\/))(www\.)?(github|gitlab|bitbucket).com([\w\.@\:/\-~]+)(\.git)?(\/)?/.test(
    gitUrl,
  );
};

const promptGitUrl = (gitUrl) => {
  let valid = validateGitUrl({ gitUrl });
  if (!valid) {
    valid = `The url should be in the form "https://github.com/user/repo"`;
  }
  return valid;
};

const validateUserInitInput = async (input) => {
  const validations = [
    {
      validation: validateProjectName,
      invalidBoolean: false,
      invalidMessage: `Project name ${projectName} is invalid. Please make sure it is between 1 and ${projectNameLength} characters.`,
    },
    {
      validation: validateGitUrl,
      invalidBoolean: false,
      invalidMessage: `URL should have the following format:\nhttps://github.com/user/repo-name`,
    },
  ];

  const status = await validateResource(input, validations);

  return status;
};

// Validate AWS credentials
const validateAwsCredentials = async () => {
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
  ];

  const status = await validateResource(null, validations);

  return status;
};

// Validate User Permissions
const validateUserPermissions = async () => {
  const validations = [
    {
      validation: hasRequiredPermissions,
      invalidBoolean: false,
      invalidMessage:
        'User requires one or more of the following permissions: AmazonEC2FullAccess, AWSLambdaFullAccess, CloudFrontFullAccess, AmazonAPIGatewayAdministrator. Please add the required permissions or add the AdministratorAccess permission',
    },
  ];

  const status = await validateResource(null, validations);

  return status;
};

// Validations helper method
const validateResource = async (resourceData, validations) => {
  let msg;

  for (let i = 0; i < validations.length; i += 1) {
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
  validateUserInitInput,
  promptProjectName,
  promptGitUrl,
  validateAwsCredentials,
  validateUserPermissions,
};

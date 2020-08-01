const { credentials } = require("./getCredentials");
const { jadeErr } = require("./logger.js");
const { exists } = require("../util/fileUtils");
const { asyncHeadBucket, asyncGetRole } = require("../aws/awsAsyncFunctions");

const cwd = process.cwd();

// checks for AWS credentials
const awsCredentialsConfigured = () => {
  console.log("Looking for AWS Credentials...");

  if (credentials) {
    console.log("Access Key:", credentials.accessKeyId);
    return true;
  } else {
    jadeErr("CredentialsError: Could not load credentials from any providers");
    console.log(
      "For instructions, please visit: https://awscli.amazonaws.com/v2/documentation/api/latest/topic/config-vars.html"
    );
    return false;
  }
};

// checks if S3 name meets AWS requirements
const isValidBucketName = (name) => {
  const regex = /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/;

  if (!regex.test(name)) {
    return false;
  } else {
    return true;
  }
};

// checks if S3 bucket name is available
const isBucketNameAvailable = async (name) => {
  const params = { Bucket: name };

  try {
    await asyncHeadBucket(params);
    return false;
  } catch (error) {
    return true;
  }
};

// checks if role exists
const roleExistsOnAws = async (name) => {
  const params = { RoleName: name };

  try {
    await asyncGetRole(params);
    return true;
  } catch (error) {
    return false;
  }
};

// checks if lambda name meets AWS requirements
const isValidLambdaName = (name) => {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;

  if (!regex.test(name)) {
    return false;
  } else {
    return true;
  }
};

// checks lambda does not already exist in cwd
const lambdaDoesNotExistInCwd = async (name) => {
  const lambdaFileExists = await exists(`${cwd}/${name}.js`);
  if (lambdaFileExists) {
    return false;
  } else {
    return true;
  }
};

// validates lambda creation
const validateLambdaCreation = async (name) => {
  const validations = [
    {
      validation: lambdaDoesNotExistInCwd,
      invalidMessage: `Name ${name} is already being used in this directory`,
    },
    {
      validation: isValidLambdaName,
      invalidMessage: `Name ${name} is invalid. It must be between 1 and 64 characters long. It may only contain letters, numbers, hyphens(-), or underscores(_)`,
    },
  ];

  const status = await validateResource(name, validations);

  return status;
};

// validates role existance on AWS
const validateRoleAssumption = async (name) => {
  const validations = [
    {
      validation: roleExistsOnAws,
      invalidMessage: `Role '${name}' does not exist`,
    },
  ];
  const status = await validateResource(name, validations);
  return status;
};

// validates S3 bucket creation
const validateBucketCreation = async (name) => {
  const validations = [
    {
      validation: isBucketNameAvailable,
      invalidMessage: `Bucket name ${name} already exists`,
    },
    {
      validation: isValidBucketName,
      invalidMessage: `Bucket name ${name} is invalid. It must be between 3 and 63 characters long. It may only contain lowercase letters, numbers, dots(.), or hyphens(-). To see the full rules for bucket naming visit: https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html`,
    },
  ];

  const status = await validateResource(name, validations);

  return status;
};

// AWS resource validation helper method
const validateResource = async (resourceData, validations) => {
  let msg;

  for (let i = 0; i < validations.length; i += 1) {
    const { validation, invalidMessage } = validations[i];
    const isValid = await validation(resourceData);

    if (!isValid) {
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
};

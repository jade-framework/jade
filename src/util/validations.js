const { credentials } = require("./getCredentials");
const { jadeErr } = require("./logger.js");
const { exists } = require("../util/fileUtils");

const cwd = process.cwd();

// checks for AWS credentials
const foundAwsCredentials = () => {
  console.log("Looking for AWS Credentials...");

  if (credentials) {
    console.log("Access Key:", credentials.accessKeyId);
    return true;
  } else {
    jadeErr("CredentialsError: Could not load credentials from any providers");
    console.log("For instructions, please visit:");
    console.log(
      "https://awscli.amazonaws.com/v2/documentation/api/latest/topic/config-vars.html"
    );
    return false;
  }
};

// checks if S3 name meets AWS requirements
const isValidS3Name = async (name) => {
  const regex = /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/;

  if (!regex.test(name)) {
    jadeErr(
      "Resource name must be between 3 and 63 characters long. It may only contain lowercase letters, numbers, dots(.), or hyphens(-). Bucket names must begin and end with a letter or number. Bucket names must not be formatted as an IP address."
    );
    return false;
  } else {
    return true;
  }
};

// checks if lambda name meets AWS requirements
const isValidLambdaName = async (name) => {
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

const validateResource = async (resourceData, validations) => {
  let msg;

  for (let i = 0; i < validations.length; i += 1) {
    const { validation, invalidMessage } = validations[i];
    const isValid = await validation(resourceData);

    if (isValid) {
      msg = invalidMessage;
      break;
    }
  }
  return msg;
};

module.exports = {
  foundAwsCredentials,
  validateLambdaCreation,
};

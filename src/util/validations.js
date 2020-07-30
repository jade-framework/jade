const { credentials } = require("../aws/awsAsyncFunctions");
const { jadeErr } = require("./logger.js");

const isAwsCliConfigured = () => {
  console.log("Looking for AWS Credentials...");

  if (credentials) {
    console.log("Access Key:", credentials.accessKeyId);
    return true;
  } else {
    jadeErr("CredentialsError: Could not load credentials from any providers");
    return false;
  }
};

const isValidLambdaName = async (name) => {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;

  if (!regex.test(resourceName)) {
    jadeErr(
      "Resource name must be between 1 and 64 characters in length. It may only contain alphanumeric characters, - or _"
    );
  }
};

const isValidS3Name = async (name) => {
  const regex = /(^[a-z\d]{1,2}((-[a-z\d])|([a-z\d]{1,2})){0,30}[a-z\d]$)|(^[‌​a-z\d]((-[a-z\d])|([‌​a-z\d]{1,2})){0,30}[‌​a-z\d-]?[a-z\d]$)/;

  if (!regex.test(resourceName)) {
    jadeErr(
      "Resource name must be between 3 and 64 characters in length. It may only contain lowercase characters, numbers, - or ."
    );
  }
};

module.exports = {
  isAwsCliConfigured,
  validateResourceName,
};
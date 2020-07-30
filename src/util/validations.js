const { credentials } = require("./getCredentials");
const { jadeErr } = require("./logger.js");

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

const isValidLambdaName = async (name) => {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;

  if (!regex.test(name)) {
    jadeErr(
      "Resource name must be between 1 and 64 characters long. It may only contain letters, numbers, hyphens(-), or underscores(_)"
    );
    return false;
  } else {
    return true;
  }
};

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

module.exports = { foundAwsCredentials };

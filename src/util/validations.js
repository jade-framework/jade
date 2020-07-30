const { credentials } = require("../aws/awsAsyncFunctions");
const { jadeErr } = require("./logger.js");

const validateAwsCliConfig = () => {
  console.log("Looking for AWS Credentials...");

  if (credentials) {
    console.log("Access Key:", credentials.accessKeyId);
    return true;
  } else {
    jadeErr("CredentialsError: Could not load credentials from any providers");
    return false;
  }
};

module.exports = { validateAwsCliConfig };

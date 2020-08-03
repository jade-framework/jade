const AWS = require("aws-sdk/global");
const config = new AWS.Config();

const credentials = config.credentials;

module.exports = { credentials };

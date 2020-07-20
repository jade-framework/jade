const { promisify } = require("util");
const AWS = require("aws-sdk");

const { getRegion } = require("../util/getRegion");

const apiVersion = "latest";
const region = getRegion();
const sts = new AWS.STS();
const codepipeline = new AWS.CodePipeline({ apiVersion, region });

// security token service
const getCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));

// CodePipeline
const createPipeline = promisify(
  codepipeline.createPipeline.bind(codepipeline)
);
const getPipeline = promisify(codepipeline.getPipeline.bind(codepipeline));
const getPipelineState = promisify(
  codepipeline.getPipelineState.bind(codepipeline)
);
const putWebhook = promisify(codepipeline.putWebhook.bind(codepipeline));

module.exports = {
  getCallerIdentity,
  createPipeline,
  getPipeline,
  getPipelineState,
  putWebhook,
};

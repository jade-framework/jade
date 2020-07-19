const AWS = require("aws-sdk");

const { getRegion } = require("../util/getRegion");

const apiVersion = "latest";
const region = getRegion();
const sts = new AWS.STS();
const codepipeline = new AWS.CodePipeline({ apiVersion, region });

// security token service
const getCallerIdentity = sts.getCallerIdentity.bind(sts);

// CodePipeline
const createPipeline = codepipeline.createPipeline.bind(codepipeline);
const getPipeline = codepipeline.getPipeline.bind(codepipeline);
const getPipelineState = codepipeline.getPipelineState.bind(codepipeline);
const putWebhook = codepipeline.putWebhook.bind(codepipeline);

module.exports = {
  getCallerIdentity,
  createPipeline,
  getPipeline,
  getPipelineState,
  putWebhook,
};

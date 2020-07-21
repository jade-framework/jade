const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const codepipelineActions = require("@aws-cdk/aws-codepipeline-actions");
const codebuild = require("@aws-cdk/aws-codebuild");

class CdkProjectStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //create bucket
    const testBucket = new s3.Bucket(this, "testing-jade-20", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    //upload file to bucket
    // new s3deploy.BucketDeployment(this, "cdk-deployment-jade-20", {
    //   sources: [s3deploy.Source.asset("./myApp")],
    //   destinationBucket: testBucket,
    // });

    //distribute to cloundFront
    new cloudfront.Distribution(this, "MyDistribution", {
      defaultBehavior: { origin: cloudfront.Origin.fromBucket(testBucket) },
    });

    // const distribution = new CloudFrontWebDistribution(this, "MyDistribution", {
    //   originConfigs: [
    //     {
    //       s3OriginSource: {
    //         s3BucketSource: testBucket,
    //       },
    //       behaviors: [{ isDefaultBehavior: true }],
    //     },
    //   ],
    // });

    const pipeline = new codepipeline.Pipeline(this, "testPipeline", {
      pipelineName: "SourcePipeline",
    });

    const sourceOutput = new codepipeline.Artifact();

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: "Retrieve_Source",
      owner: "kpatel27",
      repo: "deployment-test",
      oauthToken: "{GITHUB TOKEN}",
      output: sourceOutput,
      branch: "master",
      trigger: codepipelineActions.GitHubTrigger.WEBHOOK,
    });

    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: "S3Deploy",
      //stage: deployStage,
      bucket: testBucket,
      input: sourceOutput,
    });

    const deployStage = pipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });
  }
}

module.exports = { CdkProjectStack };

// import * as codedeploy from '@aws-cdk/aws-codedeploy';

// const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
//   pipelineName: 'MyPipeline',
// });

// // add the source and build Stages to the Pipeline...

// const deployAction = new codepipeline_actions.CodeDeployServerDeployAction({
//   actionName: 'CodeDeploy',
//   input: buildOutput,
//   deploymentGroup,
// });
// pipeline.addStage({
//   stageName: 'Deploy',
//   actions: [deployAction],
// });

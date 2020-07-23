// use aws-sdk to load CodePipeline, CodeBuild and CodeDeploy
// spin up an EC2 instance (free tier etc) and download the Gatsby docker image
// spit out built files onto S3

const { readConfig } = require("../util/fileUtils");
const { createPipeline } = require("../aws");
const uuid = require("uuid");

const setPipelineName = () => {
  return "jade-pipeline-" + uuid.v4();
};

const setSource = () => {
  return {
    actionTypeID: {
      category: "Source",
      owner: "ThirdParty",
      provider: "Github",
      version: "1",
    },
    name: "ApplicationSource",
    inputArtifacts: [],
    outputArtifacts: [{ name: "SourceArtifact" }],
    runOrder: 1,
    configuration: {
      Owner: "MyGitHubAccountName",
      Repo: "MyGitHubRepositoryName",
      PollForSourceChanges: "false",
      Branch: "master",
      OAuthToken:
        "{{resolve:secretsmanager:MyGitHubSecret:SecretString:token}}",
    },
  };
};
{
  actions: [
    /* required */
    {
      actionTypeId: {
        /* required */
        category:
          Source | Build | Deploy | Test | Invoke | Approval /* required */,
        owner: AWS | ThirdParty | Custom /* required */,
        provider: "STRING_VALUE" /* required */,
        version: "STRING_VALUE" /* required */,
      },
      name: "STRING_VALUE" /* required */,
      configuration: {
        "<ActionConfigurationKey>": "STRING_VALUE",
        /* '<ActionConfigurationKey>': ... */
      },
      inputArtifacts: [
        {
          name: "STRING_VALUE" /* required */,
        },
        /* more items */
      ],
      namespace: "STRING_VALUE",
      outputArtifacts: [
        {
          name: "STRING_VALUE" /* required */,
        },
        /* more items */
      ],
      region: "STRING_VALUE",
      roleArn: "STRING_VALUE",
      runOrder: "NUMBER_VALUE",
    },
  ];
}

const setBuild = () => {};

const setDeploy = () => {};

const setArtifactStore = () => {};

module.exports = {
  createJadePipeline: async () => {
    const { userData } = await readConfig(process.cwd());
    const params = {
      pipeline: {
        name: setPipelineName(),
        roleArn: userData.Arn,
        stages: [setSource(), setBuild(), setDeploy()],
        artifactStore: setArtifactStore(),
      },
    };
    console.log(params);
    // createPipeline(params);
  },
};

// getArn();

// var params = {
//   pipeline: {
//     /* required */ name: "STRING_VALUE" /* required */,
//     roleArn: "STRING_VALUE" /* required */,
//     stages: [
//       /* required */
//       {
//         actions: [
//           /* required */
//           {
//             actionTypeId: {
//               /* required */
//               category:
//                 Source |
//                 Build |
//                 Deploy |
//                 Test |
//                 Invoke |
//                 Approval /* required */,
//               owner: AWS | ThirdParty | Custom /* required */,
//               provider: "STRING_VALUE" /* required */,
//               version: "STRING_VALUE" /* required */,
//             },
//             name: "STRING_VALUE" /* required */,
//             configuration: {
//               "<ActionConfigurationKey>": "STRING_VALUE",
//               /* '<ActionConfigurationKey>': ... */
//             },
//             inputArtifacts: [
//               {
//                 name: "STRING_VALUE" /* required */,
//               },
//               /* more items */
//             ],
//             namespace: "STRING_VALUE",
//             outputArtifacts: [
//               {
//                 name: "STRING_VALUE" /* required */,
//               },
//               /* more items */
//             ],
//             region: "STRING_VALUE",
//             roleArn: "STRING_VALUE",
//             runOrder: "NUMBER_VALUE",
//           },
//           /* more items */
//         ],
//         name: "STRING_VALUE" /* required */,
//         blockers: [
//           {
//             name: "STRING_VALUE" /* required */,
//             type: Schedule /* required */,
//           },
//           /* more items */
//         ],
//       },
//       /* more items */
//     ],
//     artifactStore: {
//       location: "STRING_VALUE" /* required */,
//       type: S3 /* required */,
//       encryptionKey: {
//         id: "STRING_VALUE" /* required */,
//         type: KMS /* required */,
//       },
//     },
//     artifactStores: {
//       "<AWSRegionName>": {
//         location: "STRING_VALUE" /* required */,
//         type: S3 /* required */,
//         encryptionKey: {
//           id: "STRING_VALUE" /* required */,
//           type: KMS /* required */,
//         },
//       },
//       /* '<AWSRegionName>': ... */
//     },
//     version: "NUMBER_VALUE",
//   },
//   tags: [
//     {
//       key: "STRING_VALUE" /* required */,
//       value: "STRING_VALUE" /* required */,
//     },
//     /* more items */
//   ],
// };

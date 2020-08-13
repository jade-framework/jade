const { createDynamoTable } = require('./createDynamoTable');
const { putDynamoItem } = require('./putDynamoItems');
const { jadeLog } = require('../../util/logger');
const {
  appsTableName,
  versionsTableName,
} = require('../../templates/constants');

const appsItemToPut = ({
  projectName,
  gitUrl,
  bucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
  cloudFrontDomainName,
  publicIp,
  versionId,
}) => ({
  projectName: {
    S: projectName,
  },
  gitUrl: {
    S: gitUrl,
  },
  bucketName: {
    S: bucketName,
  },
  cloudFrontOriginId: {
    S: cloudFrontOriginId,
  },
  cloudFrontOriginDomain: {
    S: cloudFrontOriginDomain,
  },
  cloudFrontDomainName: {
    S: cloudFrontDomainName,
  },
  publicIp: {
    S: publicIp,
  },
  activeVersion: {
    S: versionId,
  },
});

const versionsItemToPut = ({
  projectId,
  projectName,
  gitUrl,
  bucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
  cloudFrontDomainName,
  publicIp,
  userInstallCommand,
  userBuildCommand,
  publishDirectory,
  versionId,
}) => ({
  projectId: {
    S: projectId,
  },
  projectName: {
    S: projectName,
  },
  gitUrl: {
    S: gitUrl,
  },
  bucketName: {
    S: bucketName,
  },
  cloudFrontOriginId: {
    S: cloudFrontOriginId,
  },
  cloudFrontOriginDomain: {
    S: cloudFrontOriginDomain,
  },
  cloudFrontDomainName: {
    S: cloudFrontDomainName,
  },
  publicIp: {
    S: publicIp,
  },
  userInstallCommand: {
    S: userInstallCommand,
  },
  userBuildCommand: {
    S: userBuildCommand,
  },
  publishDirectory: {
    S: publishDirectory,
  },
  versionId: {
    S: versionId,
  },
});

const initDynamo = async (projectData) => {
  try {
    // Create Jade Projects Summary Table
    const createPromise1 = createDynamoTable(appsTableName, 'projectName');
    // Create App Versions Table
    const createPromise2 = await createDynamoTable(
      versionsTableName,
      'projectId',
    );
    await Promise.all([createPromise1, createPromise2]);
    // Put initial app items to tables
    const appsItem = appsItemToPut(projectData);
    const versionsItem = versionsItemToPut(projectData);
    const putPromise1 = putDynamoItem(appsTableName, appsItem);
    const putPromise2 = putDynamoItem(versionsTableName, versionsItem);
    await Promise.all([putPromise1, putPromise2]);
    jadeLog('DynamoDB setup complete.');
  } catch (error) {
    console.log(error);
  }
};

const addAppToDynamo = async (projectData) => {
  try {
    // Put initial app items to tables
    const appsItem = appsItemToPut(projectData);
    const versionsItem = versionsItemToPut(projectData);
    const putPromise1 = putDynamoItem(appsTableName, appsItem);
    const putPromise2 = putDynamoItem(versionsTableName, versionsItem);
    await Promise.all([putPromise1, putPromise2]);
    jadeLog('DynamoDB setup complete.');
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initDynamo, addAppToDynamo };

/*
    projectId,
  gitUrl,
  bucketName,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
  cloudFrontDomainName,
  publicIp,
  userInstallCommand,
  userBuildCommand,
  publishDirectory,
*/
// JC Test data
// const data = {
//   projectId: '1597122696347',
//   projectName: 'My Jade Project',
//   gitUrl: 'https://github.com/jade-framework/gatsby-blog',
//   bucketName: 'myjadeproject-0e706840-a549-4a28-ac19-b73d80b1a64d',
//   cloudFrontOriginId: 'S3-myjadeproject-0e706840-a549-4a28-ac19-b73d80b1a64d',
//   cloudFrontOriginDomain:
//     'myjadeproject-0e706840-a549-4a28-ac19-b73d80b1a64d-prod.s3.amazonaws.com',
//   cloudFrontDomainName: 'd2vchf7s5500yn.cloudfront.net',
//   publicIp: 'http://52.33.67.24',
//   userInstallCommand: 'yarn install',
//   userBuildCommand: 'yarn build',
//   publishDirectory: 'public/',
// };
// initDynamo(data);

// test project data
// const projectData = {
//   projectName: 'My Jade Project',
//   gitExists: true,
//   gitUrl: 'https://github.com/jade-framework/gatsby-blog',
//   userInstallCommand: 'yarn install',
//   userBuildCommand: 'yarn build',
//   publishDirectory: 'public/',
//   bucketName: 'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab',
//   bucketNames: [
//     'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab-prod',
//     'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab-builds',
//     'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab-lambda',
//     'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab-stage',
//   ],
//   lambdaNames: 'jadeInvalidateCloudFrontFile',
//   cloudFrontOriginId: 'S3-myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab',
//   cloudFrontOriginDomain:
//     'myjadeproject-898b9949-624b-48e9-86ef-a306ab9436ab-prod.s3.amazonaws.com',
//   createdOn: '2020-08-12T03:21:13.714Z',
//   gitFolder: 'gatsby-blog',
//   cloudFrontDistributionId: 'EMYAVU3CFF0BM',
//   cloudFrontDomainName: 'd1aciqbh9sfymb.cloudfront.net',
//   instanceProfile: {
//     Path: '/',
//     InstanceProfileName: 'jade-ec2-instance-profile',
//     InstanceProfileId: 'AIPA6RBS5P53GFXUFWHMO',
//     Arn: 'arn:aws:iam::998686687094:instance-profile/jade-ec2-instance-profile',
//     CreateDate: '2020-08-12T03:21:52.000Z',
//     Roles: [[Object]],
//   },
//   securityGroup: { SecurityGroups: [[Object]] },
//   publicIp: '3.10.24.2',
// };

// (async () => {
//   await addAppToDynamo(projectData);
// })();

/*
CREATE RESPONSE
{
  Table: {
    AttributeDefinitions: [ [Object], [Object] ],
    TableName: 'MyJadeProject',
    KeySchema: [ [Object], [Object] ],
    TableStatus: 'ACTIVE',
    CreationDateTime: 2020-08-11T18:47:45.119Z,
    ProvisionedThroughput: {
      NumberOfDecreasesToday: 0,
      ReadCapacityUnits: 0,
      WriteCapacityUnits: 0
    },
    TableSizeBytes: 0,
    ItemCount: 0,
    TableArn: 'arn:aws:dynamodb:us-west-2:434812305662:table/MyJadeProject',
    TableId: 'aeb9b4e0-8dee-4262-a1f6-5ee5f88d0d62',
    BillingModeSummary: {
      BillingMode: 'PAY_PER_REQUEST',
      LastUpdateToPayPerRequestDateTime: 2020-08-11T18:47:45.119Z
    }
  }
}
*/

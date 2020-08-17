const { createDynamoTable } = require('./createDynamoTable');
const { putDynamoItem } = require('./putDynamoItems');
const { jadeLog, jadeErr } = require('../../util/logger');
const {
  appsTableName,
  versionsTableName,
} = require('../../templates/constants');

const appsItemToPut = ({
  projectName,
  projectId,
  gitUrl,
  bucketName,
  cloudFrontDistributionId,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
  cloudFrontDomainName,
  publicIp,
  versionId,
}) => ({
  projectName: {
    S: projectName,
  },
  bucketName: {
    S: bucketName,
  },
  gitUrl: {
    S: gitUrl,
  },
  cloudFrontDistributionId: {
    S: cloudFrontDistributionId,
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
  projectId: {
    S: projectId,
  },
  isActive: {
    BOOL: true,
  },
  isFrozen: {
    BOOL: false,
  },
});

const versionsItemToPut = ({
  projectId,
  projectName,
  gitUrl,
  bucketName,
  cloudFrontDistributionId,
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
  cloudFrontDistributionId: {
    S: cloudFrontDistributionId,
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
    const createPromise1 = createDynamoTable(
      appsTableName,
      'projectName',
      'bucketName',
    );
    // Create App Versions Table
    const createPromise2 = await createDynamoTable(
      versionsTableName,
      'projectId',
      'projectName',
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
    jadeErr(error);
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
    jadeErr(error);
  }
};

module.exports = { initDynamo, addAppToDynamo };

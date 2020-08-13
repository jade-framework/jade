const crypto = require('crypto');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const Dynamo = require('aws-sdk/clients/dynamodb');
const dynamo = new Dynamo();
const asyncDynamoPutItem = promisify(dynamo.putItem.bind(dynamo));
const asyncDynamoUpdateItem = promisify(dynamo.updateItem.bind(dynamo));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const { join } = require('path');

const appsTableName = 'JadeProjects';
const versionsTableName = 'JadeProjectsVersions';
const bucketSuffixes = ['prod', 'builds', 'lambda', 'stage'];
const userDir = join('/', 'home', 'ec2-user');
const prodBucket = bucketSuffixes[0];
const buildsBucket = bucketSuffixes[1];
const stageBucket = bucketSuffixes[3];

const versionsItemToPut = ({
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
  versionId,
  commitUrl,
}) => ({
  projectId: {
    S: projectId,
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
  commitUrl: {
    S: commitUrl,
  },
});

const putDynamoItem = async (tableName, items) => {
  let putResponse;
  try {
    const putParams = {
      TableName: tableName,
      Item: items,
    };
    putResponse = await asyncDynamoPutItem(putParams);
    console.log(`Put items to table ${tableName}.`);
  } catch (err) {
    console.log(err);
  }
  return putResponse;
};

const updateAppsTable = async (initialData) => {
  const params = {
    TableName: appsTableName,
    Key: {
      projectName: {
        S: initialData.projectName,
      },
    },
    ReturnValues: 'NONE',
    ExpressionAttributeNames: {
      '#AV': 'activeVersion',
    },
    ExpressionAttributeValues: {
      ':av': initialData.versionId,
    },
    UpdateExpression: 'SET #AV = :av',
  };
  try {
    await asyncDynamoUpdateItem(params);
  } catch (err) {
    console.log(err);
  }
};

const updateDynamo = async (webhook, initialData) => {
  console.log('Updating Dynamo...');
  const uniqueId = crypto.randomBytes(16).toString('hex');
  initialData.projectId = `${initialData.projectName}-${uniqueId}`;
  initialData.commitUrl = webhook.head_commit.url;
  const versionsItem = versionsItemToPut(initialData);
  const promise1 = putDynamoItem(versionsTableName, versionsItem);
  const promise2 = updateAppsTable(initialData);
  await Promise.all([promise1, promise2]);
  console.log('Dynamo tables updated.');
};

module.exports = async function triggerBuild(webhook) {
  if (!webhook.ref) {
    return {
      statusCode: 202,
      msg: 'Webhook successfully received by EC2. Welcome to Jade!',
    };
  }
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;
  const repoDir = join(userDir, repoName);
  const branch = webhook.ref.replace('refs/heads/', '');

  try {
    const initialProjectData = await readFile(
      join(userDir, 'server', 'initialProjectData.json'),
    );

    // need to change to find the right bucketName for multiple apps
    const initialData = JSON.parse(initialProjectData)[0];
    initialData.versionId = Date.now();

    const { bucketName } = initialData;
    let pull;

    if (branch === 'master') {
      await exec(`git -C ${repoDir} checkout master`);
      pull = await exec(`git -C ${repoDir} pull ${cloneUrl}`);
    } else if (branch === 'staging') {
      await exec(`git -C ${repoDir} checkout staging`);
      pull = await exec(`git -C ${repoDir} pull -X theirs --no-edit`);
    }

    if (/Already up to date/.test(pull.stdout)) {
      return {
        statusCode: 202,
        msg: 'Repo has not changed, build not triggered.',
      };
    }

    (async () => {
      try {
        // need to get info from Dynamo, especially publish directory "public"
        if (branch === 'master') {
          await exec(`yarn --cwd ${repoDir} build`);
          console.log('Built', repoDir);
          await exec(
            `aws s3 sync ${repoDir}/public s3://${bucketName}-${prodBucket}`,
          );
          await exec(`zip -r ${repoDir}/${versionId} ${repoDir}/public`);
          await exec(
            `aws s3api put-object --bucket ${bucketName}-${buildsBucket} --key ${versionId}.zip --body ${repoDir}/${versionId}.zip`,
          );
          console.log(`Upload to s3://${bucketName}-${prodBucket} complete`);
          console.log(
            `Upload to s3://${bucketName}-${buildsBucket}/${versionId} complete`,
          );
          await updateDynamo(webhook, initialData);
          // update Apps table with activeVersion: versionId
          // update Version row with versionId
          // add commit URL

          await exec(`rm ${repoDir}/${versionId}.zip`);
        } else if (branch === 'staging') {
          await exec(`yarn --cwd ${repoDir} build`);
          await exec(
            `aws s3 sync ${repoDir}/public s3://${bucketName}-${stageBucket}`,
          );
          console.log(`Upload to s3://${bucketName}-${stageBucket} complete`);
        }
      } catch (err) {
        console.log(err); // convert to logger later
      }
    })();

    return {
      statusCode: 200,
      msg: 'Webhook successfully processed, Jade build triggered.',
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 202,
      msg: 'Error in processing your webhook, please contact Jade team...',
      error: err,
    };
  }
};

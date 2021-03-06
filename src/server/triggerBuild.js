const { promisify } = require('util');
const { join } = require('path');
const fs = require('fs');
const { getRegion } = require('./getRegion');
const exec = promisify(require('child_process').exec);
const readFile = promisify(fs.readFile);
const { log, logErr } = require('./logger');

const AWS = require('aws-sdk');
const { homedir } = require('os');
const region = getRegion();
const apiVersion = 'latest';
AWS.config.update({ region });
const documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion,
});

const asyncPut = promisify(documentClient.put.bind(documentClient));
const asyncUpdate = promisify(documentClient.update.bind(documentClient));

const appsTableName = 'JadeProjects';
const versionsTableName = 'JadeProjectsVersions';
const bucketSuffixes = ['prod', 'builds', 'lambda', 'stage'];
const userDir = join('/', 'home', 'ec2-user');
const prodBucket = bucketSuffixes[0];
const buildsBucket = bucketSuffixes[1];
const stageBucket = bucketSuffixes[3];

const parseName = (name) => {
  name = name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
  if (name.length === 0) name = 'jade-framework';
  return name;
};

const updateDynamo = async (data) => {
  log('Updating Dynamo...');

  const {
    projectId,
    gitUrl,
    bucketName,
    cloudFrontDistributionId,
    cloudFrontOriginId,
    cloudFrontOriginDomain,
    cloudFrontDomainName,
    publicIp,
    versionId,
    commitUrl,
    projectName,
  } = data;

  const item = {
    bucketName,
    cloudFrontDistributionId,
    cloudFrontOriginId,
    cloudFrontOriginDomain,
    cloudFrontDomainName,
    commitUrl,
    gitUrl,
    projectId,
    projectName,
    publicIp,
    versionId,
  };

  try {
    await asyncPut({
      TableName: versionsTableName,
      Item: item,
    });
    await asyncUpdate({
      TableName: appsTableName,
      Key: { projectName, bucketName },
      UpdateExpression: 'SET activeVersion = :v',
      ExpressionAttributeValues: {
        ':v': versionId,
      },
    });

    log('DynamoDB table updated.');
  } catch (err) {
    logErr(err);
  }
};

const runDockerBuild = async (repoName, repoDir) => {
  // Build docker image
  log('Building docker image...');
  await exec(
    `sudo docker build ${userDir} -t build-app --build-arg REPO_NAME=${repoName} -f ${userDir}/Dockerfile`,
  );
  // Run container, mount userDir as volume mapped to output folder in container
  // Remove container after script runs
  log('Building app in container...');
  await exec(
    `sudo docker run --name build -p 6000-6000 --rm -v ${repoDir}:/output build-app`,
  );
};

module.exports = async function triggerBuild(webhook) {
  if (!webhook.ref) {
    return {
      statusCode: 202,
      msg: 'Webhook successfully received by EC2. Welcome to Jade!',
    };
  }
  log('Webhook being processed...');
  const { repository } = webhook;
  const repoName = repository.name;
  const cloneUrl = repository.clone_url;
  const repoDir = join(userDir, repoName);
  const branch = webhook.ref.replace('refs/heads/', '');
  log('webhook', webhook);
  log('branch', branch);
  log('Before pull try block');
  try {
    const initialProjectData = await readFile(
      join(userDir, 'server', 'initialProjectData.json'),
    );
    log('After initial proj data');
    const initialData = JSON.parse(initialProjectData);
    const date = Date.now().toString();
    initialData.versionId = date;
    initialData.projectId = `${parseName(initialData.projectName)}-${date}`;
    initialData.commitUrl = webhook.head_commit.url;

    const { bucketName } = initialData;
    let pull;
    log('Pull repo');
    if (branch === 'master') {
      await exec(`git -C ${repoDir} checkout master`);
      pull = await exec(`git -C ${repoDir} pull ${cloneUrl}`);
      log('Finish pull master');
      log(pull);
    } else if (branch === 'staging') {
      await exec(`git -C ${repoDir} checkout staging`);
      pull = await exec(`git -C ${repoDir} pull -X theirs --no-edit`);
      log('Finish pull staging');
      log(pull);
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
          await exec(`sudo yum update -y`);

          await runDockerBuild(repoName, repoDir);

          log('Built', repoDir);
          await exec(
            `aws s3 sync ${repoDir}/public s3://${bucketName}-${prodBucket}`,
          );
          await exec(`zip -r ${repoDir}/${date} ${repoDir}/public`);
          await exec(
            `aws s3api put-object --bucket ${bucketName}-${buildsBucket} --key ${date}.zip --body ${repoDir}/${date}.zip`,
          );
          await exec(`rm ${repoDir}/${date}.zip`);
          log(`Upload to s3://${bucketName}-${prodBucket} complete`);
          log(`Upload to s3://${bucketName}-${buildsBucket}/${date} complete`);
          await updateDynamo(initialData);
        } else if (branch === 'staging') {
          await exec(`sudo yum update -y`);
          await runDockerBuild(repoName, repoDir);

          await exec(
            `aws s3 sync ${repoDir}/public s3://${bucketName}-${stageBucket}`,
          );
          log(`Upload to s3://${bucketName}-${stageBucket} complete`);
        }
      } catch (err) {
        logErr(err);
      }
    })();
    return {
      statusCode: 200,
      msg: 'Webhook successfully processed, Jade build triggered.',
    };
  } catch (err) {
    logErr(err);
    return {
      statusCode: 202,
      msg: 'Error in processing your webhook, please contact Jade team...',
      error: err,
    };
  }
};

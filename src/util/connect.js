const {
  getJadePath,
  readFile,
  exists,
  join,
  sleep,
  removeFile,
  createJSONFile,
  writeAwsConfig,
} = require('./fileUtils');
const {
  cwd,
  bucketSuffixes,
  privateKeyFilename,
  initialProjectData,
} = require('../templates/constants');
const { getRegion } = require('../server/getRegion');
const { getConnection } = require('./sshConnection');
const { jadeLog, jadeErr } = require('./logger');
const { parseName } = require('./helpers');

const region = getRegion();
const jadePath = getJadePath(cwd);
const remoteHomeDir = '/home/ec2-user';
const remoteServerDir = `${remoteHomeDir}/server`;
const serverSourceDir = join(__dirname, '..', 'server');
const prodBucket = bucketSuffixes[0];
const buildsBucket = bucketSuffixes[1];

const setupCommands = [
  'sudo yum update -y',
  'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash',
  '. ~/.nvm/nvm.sh',
  'nvm install node',
  'npm install -g yarn',
  'sudo amazon-linux-extras install nginx1 -y',
  `sudo mv ${remoteServerDir}/sysmon.conf /etc/nginx/conf.d/sysmon.conf`,
  'sudo systemctl start nginx',
  `sudo mkdir ${remoteHomeDir}/.aws`,
  `sudo mv ${remoteServerDir}/config ${remoteHomeDir}/.aws/config`,
  `cd ${remoteServerDir}`,
  'yarn add aws-sdk',
  `node ${remoteServerDir}/server.js > logger.log 2>&1 &`,
  `cd ${remoteHomeDir}`,
  'sudo yum install git -y',
];

const buildCommands = ({
  gitUrl,
  gitFolder,
  bucketName,
  userInstallCommand,
  userBuildCommand,
  publishDirectory,
  versionId,
}) => {
  const repoDir = `${remoteHomeDir}/${gitFolder}`;
  return [
    `git clone ${gitUrl}`,
    `cd ${repoDir}`,
    userInstallCommand,
    userBuildCommand,
    `aws s3 sync ${publishDirectory} s3://${bucketName}-${prodBucket}`,
    `zip -r ${repoDir}/${versionId} ${repoDir}/${publishDirectory}`,
    `aws s3api put-object --bucket ${bucketName}-${buildsBucket} --key ${versionId}.zip --body ${repoDir}/${versionId}.zip`,
  ];
};

const checkConnError = (err) => {
  if (!/ECONNREFUSED/.test(err)) {
    jadeErr(err);
  }
  jadeLog(`Retrying connection to EC2 server...`);
};

const getHost = async ({ publicIp }) => {
  try {
    if (!(await exists(join(jadePath, privateKeyFilename)))) {
      jadeErr('Your private key is not found, please run `jade init` again.');
      return false;
    }
    jadeLog('Accessing private key...');
    const privateKey = await readFile(join(jadePath, privateKeyFilename));

    // check if host and key is valid
    const host = {
      host: publicIp,
      port: 22,
      username: 'ec2-user',
      privateKey,
    };
    return host;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const sendSetupFiles = async (host, maxRetries = 10, attempts = 0) => {
  try {
    if (attempts >= maxRetries) return Promise.reject('Too many attempts.');
    await getConnection(host)
      .then(async (conn) => {
        await conn.asyncSftp(
          remoteServerDir,
          join(serverSourceDir, 'server.js'),
          join(serverSourceDir, 'triggerBuild.js'),
          join(serverSourceDir, 'sysmon.conf'),
          join(serverSourceDir, 'getRegion.js'),
          join(jadePath, 'config'),
          join(jadePath, 'initialProjectData.json'),
        );
        await removeFile(jadePath, 'config');
        await removeFile(jadePath, 'initialProjectData.json');
        return true;
      })
      .catch(async (err) => {
        checkConnError(err);
        await sleep(5000);
        return await sendSetupFiles(host, maxRetries, attempts + 1);
      });
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const sendCommands = async (host, commands, maxRetries = 10, attempts = 0) => {
  try {
    if (attempts >= maxRetries) return Promise.reject('Too many attempts.');
    await getConnection(host)
      .then(async (conn) => {
        await conn.asyncShell([...commands, 'exit\n'].join('\n'));
        return true;
      })
      .catch(async (err) => {
        checkConnError(err);
        await sleep(5000);
        return await sendCommands(host, commands, maxRetries, attempts + 1);
      });
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

const sendFilesAndBuildCommands = async (projectData) => {
  try {
    const { projectName } = projectData;
    const host = await getHost(projectData);
    if (!host) return;

    const date = Date.now().toString();
    projectData.versionId = date;
    projectData.projectId = `${parseName(projectName)}-${date}`;
    await createJSONFile(initialProjectData, jadePath, projectData);

    const commands = [...setupCommands, ...buildCommands(projectData)];
    await writeAwsConfig(region, jadePath);
    await sendSetupFiles(host);
    await sendCommands(host, commands);
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = { sendFilesAndBuildCommands };

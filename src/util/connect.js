const {
  getJadePath,
  readFile,
  exists,
  join,
  sleep,
  removeFile,
  writeAwsConfig,
} = require('./fileUtils');
const {
  cwd,
  bucketSuffixes,
  privateKeyFilename,
} = require('../templates/constants');
const { getRegion } = require('./getRegion');
const { getConnection } = require('./sshConnection');
const { jadeLog, jadeErr } = require('./logger');

const region = getRegion();
const jadePath = getJadePath(cwd);
const remoteHomeDir = '/home/ec2-user';
const remoteServerDir = `${remoteHomeDir}/server`;
const localDir = join(cwd, 'src', 'server');
const prodBucket = bucketSuffixes[0];
const buildsBucket = bucketSuffixes[1];

const setupCommands = [
  'sudo yum update -y',
  'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash',
  '. ~/.nvm/nvm.sh',
  'nvm install node',
  'npm install -g yarn aws-sdk',
  'sudo amazon-linux-extras install nginx1 -y',
  `sudo mv ${remoteServerDir}/sysmon.conf /etc/nginx/conf.d/sysmon.conf`,
  'sudo systemctl start nginx',
  `node ${remoteServerDir}/server.js &`,
  'sudo yum install git -y',
  `sudo mv /home/ec2-user/server/config /home/ec2-user/.aws/config `,
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
          join(localDir, 'server.js'),
          join(localDir, 'triggerBuild.js'),
          join(localDir, 'sysmon.conf'),
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
    const host = await getHost(projectData);
    if (!host) return;

    projectData.versionId = Date.now().toString();

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

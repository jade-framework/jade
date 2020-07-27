const {
  join,
  getJadePath,
  readJSONFile,
  readFile,
  sleep,
  createJSONFile,
} = require("../util/fileUtils");
const {
  hostDirectory,
  privateKeyFilename,
} = require("../constants/allConstants");
const { getConnection } = require("../util/sshConnection");

const jadePath = getJadePath(hostDirectory);
const remoteDir = "/home/ec2-user/server";
const localDir = join(hostDirectory, "src", "server");

// TODO: divide these into "installation" and "runtime" commands
const linuxCommands = [
  "sudo yum update -y",
  "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash",
];

const nodeCommands = [
  ". ~/.nvm/nvm.sh",
  "nvm install node",
  "npm install -g yarn",
];

const gitCommands = [
  "sudo yum install git -y",
  "git clone https://github.com/jade-framework/gatsby-blog",
];

const buildCommands = ["cd gatsby-blog", "yarn install", "yarn build"];

const webhookCommands = [
  "sudo amazon-linux-extras install nginx1 -y",
  "sudo mv /home/ec2-user/server/sysmon.conf /etc/nginx/conf.d/sysmon.conf",
  "sudo systemctl start nginx",
  "node /home/ec2-user/server/server.js &",
];

const deployCommands = (bucketName) => {
  return [`aws s3 sync public s3://${bucketName}`];
};

const sendSetupCommands = async (
  host,
  bucketName,
  maxRetries = 10,
  attempts = 0
) => {
  if (attempts >= maxRetries) return Promise.reject("Too many attempts.");
  await getConnection(host)
    .then(async (conn) => {
      await conn.asyncShell(
        [
          ...linuxCommands,
          ...nodeCommands,
          ...gitCommands,
          ...buildCommands,
          ...webhookCommands,
          ...deployCommands(bucketName),
          "exit\n",
        ].join("\n")
      );
    })
    .catch(async (err) => {
      console.log(err);
      await sleep(5000);
      sendSetupCommands(host, maxRetries, attempts + 1);
    });
};

const sendSetupFiles = async (host, maxRetries = 10, attempts = 0) => {
  if (attempts >= maxRetries) return Promise.reject("Too many attempts.");
  await getConnection(host)
    .then(async (conn) => {
      await conn.asyncSftp(
        remoteDir,
        join(localDir, "server.js"),
        join(localDir, "triggerBuild.js"),
        join(localDir, "sysmon.conf"),
        join(jadePath, "s3BucketName.json")
      );
    })
    .catch(async (err) => {
      console.log(err);
      await sleep(5000);
      sendSetupFiles(host, maxRetries, attempts + 1);
    });
};

async function installEc2JadeEnvironment(bucketName) {
  const privateKey = await readFile(join(jadePath, privateKeyFilename));

  try {
    console.log("Reading EC2 data...");
    const ec2Data = await readJSONFile("ec2Instance", jadePath);
    const publicIp = ec2Data.Instances[0].PublicIpAddress;

    const host = {
      host: publicIp,
      port: 22,
      username: "ec2-user",
      privateKey,
    };

    await createJSONFile("s3BucketName", jadePath, { bucketName });

    console.log("Beginning connection to EC2 server...");

    await sendSetupFiles(host);
    await sendSetupCommands(host, bucketName);
    console.log("EC2 server setup successfully.");
    return;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { installEc2JadeEnvironment };

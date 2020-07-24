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

const Client = require("ssh2").Client;

const jadePath = getJadePath(hostDirectory);

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

const sendCommands = (conn, bucketName) => {
  conn.shell((err, stream) => {
    if (err) throw err;
    stream
      .on("close", () => {
        console.log("Stream :: close");
        conn.end();
      })
      .on("data", (data) => {
        console.log("OUTPUT: " + data);
      });
    stream.end(
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
  });
};

const sendFiles = async (conn) => {
  const serverDir = "/home/ec2-user/server";
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.mkdir(serverDir, {}, (err) => {
      if (err) throw err;

      sftp.fastPut(
        join(hostDirectory, "src", "server", "server.js"),
        join(serverDir, "server.js"),
        {},
        (err) => {
          if (err) throw err;
          sftp.fastPut(
            join(hostDirectory, "src", "server", "triggerBuild.js"),
            join(serverDir, "triggerBuild.js"),
            {},
            (err) => {
              if (err) throw err;
              sftp.fastPut(
                join(hostDirectory, "src", "server", "sysmon.conf"),
                join(serverDir, "sysmon.conf"),
                {},
                (err) => {
                  if (err) throw err;
                  sftp.fastPut(
                    join(jadePath, "s3BucketName.json"),
                    join(serverDir, "s3BucketName.json"),
                    {},
                    err => {
                      if (err) throw err;
                      console.log("Files uploaded to EC2.");
                    }
                  )
                }
              );
            }
          );
        }
      );
    });
  });
};

const sshConnection = async (host) => {
  const conn = new Client();
  let connected = false;

  conn.on("error", (err) => {
    connected = false;
  });
  conn.on("ready", () => {
    connected = true;
    console.log("Client ready");
    // Handle SFTP
    await sendFiles(conn);

    // Handle installation, build and deploy commands
    sendCommands(conn);
  });

  conn.connect(host);
  let attempts = 1;
  await sleep(5000);

  while (!connected && attempts < 10) {
    console.log("Waiting for EC2 instance to accept SSH requests...");
    attempts++;
    conn.connect(host);
    await sleep(5000);
  }
};

module.exports = async function installEC2JadeEnvironment(bucketName) {
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

    await createJSONFile("s3BucketName", jadePath, {bucketName});

    console.log("Beginning connection to EC2 server...");
    await sshConnection(host, bucketName);
    console.log("EC2 server setup successfully.");
    return;
  } catch (err) {
    console.log(err);
  }
};

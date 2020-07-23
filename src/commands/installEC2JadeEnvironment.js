const {
  join,
  getJadePath,
  readJSONFile,
  readFile,
  sleep,
} = require("../util/fileUtils");
const {
  hostDirectory,
  privateKeyFilename,
} = require("../constants/allConstants");

const Client = require("ssh2").Client;

const jadePath = getJadePath(hostDirectory);

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
  // github auth token
  // git clone their repo
  "git clone https://github.com/JeremyCrichton/gatsby-test",
];

const buildCommands = ["cd gatsby-test", "yarn install", "yarn build"];

const deployCommands = ["aws s3 sync public s3://bucket-sounds-cool-to-me"];

const sshConnection = async (host) => {
  const conn = new Client();
  let connected = false;

  conn.on("error", (err) => {
    connected = false;
  });
  conn.on("ready", () => {
    connected = true;
    console.log("Client ready");
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
          ...deployCommands,
          "exit\n",
        ].join("\n")
      );
    });
  });

  conn.connect(host);
  let attempts = 1;
  await sleep(5000);

  while (!connected && attempts < 10) {
    console.log("Attempting to connect to EC2 instance again...");
    attempts++;
    conn.connect(host);
    await sleep(5000);
  }
};

module.exports = async function installEC2JadeEnvironment() {
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

    console.log("Beginning connection to EC2 server...");
    await sshConnection(host);
  } catch (err) {
    console.log(err);
  }
};

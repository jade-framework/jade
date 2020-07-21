const { createEC2Instance } = require("../aws/ec2/createEC2Instance");
const {
  join,
  getJadePath,
  readJSONFile,
  readFile,
} = require("../util/fileUtils");
const { hostDirectory, keyPairFilename } = require("../constants/allConstants");

const Client = require("ssh2").Client;
const conn = new Client();

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
  "git clone https://github.com/JeremyCrichton/gatsby-test",
];

const buildCommands = ["cd gatsby-test", "yarn install", "yarn build"];

async function installEC2JadeEnvironment() {
  const privateKey = await readFile(join(jadePath, keyPairFilename));

  try {
    const ec2Data = await readJSONFile("ec2Instance", jadePath);
    const publicIp = ec2Data.Instances[0].PublicIpAddress;
    conn
      .on("ready", () => {
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
          // stream.end("ls -al\nexit\n");
          stream.end(
            [
              ...linuxCommands,
              ...nodeCommands,
              ...gitCommands,
              ...buildCommands,
              "exit\n",
            ].join("\n")
          );
        });
      })
      .connect({
        host: publicIp,
        port: 22,
        username: "ec2-user",
        privateKey,
      });
  } catch (err) {
    console.log(err);
  }
}

installEC2JadeEnvironment();

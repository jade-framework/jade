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

async function installBuildFiles() {
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
          stream.end("ls -al\n");
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

installBuildFiles();

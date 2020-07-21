const { createEC2Instance } = require("../aws/ec2/createEC2Instance");
const fs = require("fs");
const path = require("path");
const { getJadePath, readJSONFile } = require("../util/fileUtils");
const { hostDirectory, keyPairFilename } = require("../constants/allConstants");

const Client = require("ssh2").Client;
const conn = new Client();

const jadePath = getJadePath(hostDirectory);

const privateKey = fs.readFileSync(path.join(jadePath, keyPairFilename));

async function installBuildFiles() {
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
          stream.end("ls -l\nexit\n");
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

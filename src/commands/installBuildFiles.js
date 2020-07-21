const { createEC2Instance } = require("../aws/ec2/createEC2Instance");
const fs = require("fs");
const path = require("path");
const { getJadePath } = require("../util/fileUtils");
const { hostDirectory } = require("../constants/allConstants");

const Client = require("ssh2").Client;
const conn = new Client();

const privateKey = fs.readFileSync(
  path.join(getJadePath(hostDirectory), "jade-key-pair.pem")
);

try {
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
      host: "35.176.90.79",
      port: 22,
      username: "ec2-user",
      privateKey,
    });
} catch (err) {
  console.log(err);
}

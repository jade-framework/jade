const http = require("http");
const triggerBuild = require("../src/server/triggerBuild");

const port = 5000;
const ec2InstanceMetadata =
  "http://169.254.169.254/latest/meta-data/local-ipv4";

async function start() {
  try {
    http.get(ec2InstanceMetadata, (res) => {
      let hostname = "";
      res.on("data", (data) => {
        hostname += data;
      });
      res.on("end", () => {
        const server = http.createServer((req, res) => {
          req.on("error", (err) => {
            console.error(err);
            res.statusCode = 400;
            res.end();
          });
          res.on("error", (err) => {
            console.error(err);
          });

          if (req.method === "POST" && req.url === "/webhook") {
            let body = [];
            req
              .on("data", (chunk) => {
                body.push(chunk);
              })
              .on("end", () => {
                body = JSON.parse(Buffer.concat(body).toString());
                triggerBuild(body);
                console.log(body);
                res.statusCode = 200;
                res.end("Webhook successfully processed.");
              });
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
        server.listen(port, hostname, () => {
          console.log(`Server running at http://${hostname}:${port}/`);
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

start();

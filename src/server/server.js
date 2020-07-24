const http = require("http");
const triggerBuild = require("./triggerBuild");

const hostname = "0.0.0.0";
const port = 5000;
async function start() {
  try {
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
            console.log(body); // convert to logger later
            (async () => {
              const { statusCode, msg } = await triggerBuild(body);
              res.statusCode = statusCode;
              res.end(msg);
            })();
          });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });

    server.listen(port, hostname, () => {
      console.log(`Node server listening at http://${hostname}:${port}/`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();

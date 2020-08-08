const https = require("https");
const { promisify } = require("util");
const { createJSONFile, getJadePath } = require("./fileUtils");
const { cwd } = require("../templates/constants");

// module.exports =
function getGithubIp(callback) {
  https
    .get(
      "https://api.github.com/meta",
      {
        headers: {
          "User-Agent": "Jade",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          callback(null, JSON.parse(data));
        });
      }
    )
    .on("error", (err) => {
      console.error("Error: " + err);
      callback(err);
    });
}

module.exports = promisify(getGithubIp);

const https = require("https");
const { createJSONFile, getJadePath } = require("../util/fileUtils");
const { hostDirectory } = require("../constants/allConstants");

module.exports = async function getGithubIp() {
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
          createJSONFile(
            "githubApi",
            getJadePath(hostDirectory),
            JSON.parse(data)
          );
        });
      }
    )
    .on("error", (err) => {
      console.error(err);
    });
};

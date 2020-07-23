const fs = require("fs");
const path = require("path");
const { getJadePath } = require("../../src/util/fileUtils");
const { hostDirectory } = require("../../src/constants/allConstants");

const jadePath = getJadePath(hostDirectory);

module.exports = function () {
  fs.readdir(jadePath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(jadePath, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

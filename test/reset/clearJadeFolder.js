const fs = require("fs");
const path = require("path");
const { getJadePath } = require("../../src/util/fileUtils");
const { cwd } = require("../../src/templates/constants");

const jadePath = getJadePath(cwd);

async function clearJadeFolder() {
  fs.readdir(jadePath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(jadePath, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = { clearJadeFolder };

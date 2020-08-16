const fs = require('fs');
const { getJadePath } = require('../fileUtils');
const { cwd } = require('../../templates/constants');
const { jadeLog, jadeErr } = require('../logger');

const jadePath = getJadePath(cwd);

async function deleteJadeFolder() {
  fs.rmdir(jadePath, { recursive: true }, (err) => {
    if (err) jadeErr(err);

    jadeLog(`${jadePath} is deleted!`);
  });
}

module.exports = { deleteJadeFolder };

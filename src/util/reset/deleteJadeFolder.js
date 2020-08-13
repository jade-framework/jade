const fs = require('fs');
const path = require('path');
const { getJadePath } = require('../fileUtils');
const { cwd } = require('../../templates/constants');

const jadePath = getJadePath(cwd);

async function deleteJadeFolder() {
  fs.rmdir(jadePath, { recursive: true }, (err) => {
    if (err) throw err;

    console.log(`${jadePath} is deleted!`);
  });
}

module.exports = { deleteJadeFolder };

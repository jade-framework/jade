const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const getJadePath = (path) => `${path}/.jade`;

const exists = async (path) =>
  new Promise((res) => {
    fs.access(path, (err) => res(!err));
  });

const readConfig = async (path) => {
  const jadePath = getJadePath(path);
  const config = await fs.readFile(`${jadePath}/config.json`);
  return JSON.parse(config);
};

const writeConfig = async (path, config) => {
  const jadePath = getJadePath(path);
  const configJSON = JSON.stringify(config, null, 2);
  await fs.writeFile(`${jadePath}/config.json`, configJSON);
};

const createDirectory = async (name, path) => {
  const dir = `${path}/${name}`;

  const dirExists = await exists(dir);
  console.log(dirExists);
  // if (!dirExists) {
  //   await mkdir(dir);
  // }
};

createDirectory("src", "/home/edmondtam/LS/capstone/cp/jade");

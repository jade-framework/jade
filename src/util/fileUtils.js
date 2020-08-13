const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');

const getJadePath = (path) => join(path, '.jade');
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

const exists = async (path) =>
  new Promise((res) => {
    fs.access(path, (err) => res(!err));
  });

const readConfig = async (path) => {
  const jadePath = getJadePath(path);
  const config = await readFile(join(jadePath, 'config.json'));
  return JSON.parse(config);
};

// Create config file
const writeConfig = async (path, config) => {
  const jadePath = getJadePath(path);
  const configJSON = JSON.stringify(config, null, 2);
  await writeFile(join(jadePath, 'config.json'), configJSON);
};

const createDirectory = async (name, path) => {
  const dir = join(path, name);

  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir);
  }
};

const createJSONFile = async (fileName, path, json) => {
  const configStr = JSON.stringify(json, null, 2);
  await writeFile(join(path, `${fileName}.json`), configStr);
};

const readJSONFile = async (fileName, path) => {
  const data = await readFile(join(path, `${fileName}.json`));
  return JSON.parse(data);
};

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

const writeAwsConfig = async (region, path) => {
  const data = `[default]\nregion=${region}`;
  await writeFile(join(path, `config`), data);
};

module.exports = {
  join,
  exists,
  chmod,
  readdir,
  unlink,
  getJadePath,
  readFile,
  writeFile,
  readConfig,
  writeConfig,
  createDirectory,
  createJSONFile,
  readJSONFile,
  sleep,
  writeAwsConfig,
};

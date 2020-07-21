const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { hostDirectory } = require("../constants/allConstants");

const getJadePath = (_path) => path.join(_path, ".jade");
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

const exists = async (_path) =>
  new Promise((res) => {
    fs.access(_path, (err) => res(!err));
  });

const readConfig = async (_path) => {
  const jadePath = getJadePath(_path);
  const config = await readFile(path.join(jadePath, "config.json"));
  return JSON.parse(config);
};

const writeConfig = async (_path, config) => {
  const jadePath = getJadePath(_path);
  const configJSON = JSON.stringify(config, null, 2);
  await writeFile(path.join(jadePath, "config.json"), configJSON);
};

const createDirectory = async (name, _path) => {
  const dir = path.join(_path, name);

  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir);
  }
};

const createJSONFile = async (fileName, _path, json) => {
  const configStr = JSON.stringify(json, null, 2);
  await writeFile(path.join(_path, `${fileName}.json`), configStr);
};

const readJSONFile = async (fileName, _path) => {
  const data = await readFile(path.join(_path, `${fileName}.json`));
  return JSON.parse(data);
};

async function test(_path) {
  await createDirectory(".jade", _path);
  await writeConfig(_path, { hi: "there" });
  await readConfig(_path);
}

test(hostDirectory);

module.exports = {
  getJadePath,
  readFile,
  writeFile,
  chmod,
  readConfig,
  writeConfig,
  createDirectory,
  createJSONFile,
  readJSONFile,
};

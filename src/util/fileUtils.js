const fs = require("fs");
const { join } = require("path");
const { promisify } = require("util");
const { hostDirectory } = require("../constants/allConstants");

const getJadePath = (path) => join(path, ".jade");
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

const exists = async (path) =>
  new Promise((res) => {
    fs.access(path, (err) => res(!err));
  });

const readConfig = async (path) => {
  const jadePath = getJadePath(path);
  const config = await readFile(join(jadePath, "config.json"));
  return JSON.parse(config);
};

const writeConfig = async (path, config) => {
  const jadePath = getJadePath(path);
  const configJSON = JSON.stringify(config, null, 2);
  await writeFile(join(jadePath, "config.json"), configJSON);
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

async function test(path) {
  await createDirectory(".jade", path);
  await writeConfig(path, { hi: "there" });
  await readConfig(path);
}

test(hostDirectory);

module.exports = {
  join,
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

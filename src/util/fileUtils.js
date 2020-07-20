const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const getJadePath = (_path) => path.join(_path, ".jade");
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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

async function test(_path) {
  await createDirectory(".jade", _path);
  await writeConfig(_path, { hi: "there" });
  await readConfig(_path);
}

module.exports = {
  readConfig,
  writeConfig,
  createDirectory,
};

const os = require("os");
const { readFileSync } = require("fs");
const path = require("path");

// note that the user must have an aws config file
const awsConfig = path.join(os.homedir(), ".aws", "config");

const getRegionFromConfigStr = (configStr) => {
  const defaultProfile = configStr.split("[").find((el) => el.match("default"));
  const regionLine = defaultProfile
    .split("\n")
    .find((el) => el.match("region"));
  const [, region] = regionLine.split("= ");
  return region;
};

const getRegion = () => {
  try {
    const configStr = readFileSync(awsConfig, "utf8");
    return getRegionFromConfigStr(configStr);
  } catch (err) {
    return false;
  }
};

module.exports = {
  getRegion,
};

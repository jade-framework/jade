const os = require('os');
const { readFileSync } = require('fs');
const { join } = require('path');

let awsConfig;
const getAwsConfig = () => {
  try {
    return join(os.homedir(), '.aws', 'config');
  } catch (err) {
    return false;
  }
};
awsConfig = getAwsConfig();

const getRegionFromConfigStr = (configStr) => {
  const defaultProfile = configStr.split('[').find((el) => el.match('default'));
  const regionLine = defaultProfile
    .split('\n')
    .find((el) => el.match('region'));
  const [, region] = regionLine.split('=');
  return region.trim();
};

const getRegion = () => {
  try {
    const configStr = readFileSync(awsConfig, 'utf8');
    return getRegionFromConfigStr(configStr);
  } catch (err) {
    return false;
  }
};

module.exports = {
  getRegion,
};

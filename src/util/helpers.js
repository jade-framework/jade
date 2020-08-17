const { bucketSuffixes } = require('../templates/constants');
const { jadeLog } = require('./logger');

const getBucketNames = (bucketName) => {
  return bucketSuffixes.map((suffix) => `${bucketName}-${suffix}`);
};

const parseName = (name) => {
  name = name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
  if (name.length === 0) name = 'jade-framework';
  return name;
};

const getGitFolder = (url) => {
  const parts = url.split('/');
  const part = parts.find((part) => /\.com/.test(part));
  const index = parts.indexOf(part);
  return parts[index + 2];
};

const appNotFound = () => {
  jadeLog(
    'This is not a valid Jade app name. Please use "jade list" to see your current Jade apps.',
  );
};

module.exports = { getBucketNames, parseName, getGitFolder, appNotFound };

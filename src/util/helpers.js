const { bucketSuffixes } = require('../templates/constants');

const getBucketNames = (bucketName) => {
  return bucketSuffixes.map((suffix) => `${bucketName}-${suffix}`);
};

const parseName = (name) => {
  return name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
};

const getGitFolder = (url) => {
  const parts = url.split('/');
  const part = parts.find((part) => /\.com/.test(part));
  const index = parts.indexOf(part);
  return parts[index + 2];
};

module.exports = { getBucketNames, parseName, getGitFolder };
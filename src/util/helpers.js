const getBucketNames = (bucketName) => {
  const suffixes = ['live', 'builds', 'lambda'];
  return suffixes.map((suffix) => `${bucketName}-${suffix}`);
};

const parseName = (name) => {
  return name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
};

module.exports = { getBucketNames, parseName };

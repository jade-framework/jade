const https = require('https');
const { promisify } = require('util');

let getGithubIp = (callback) => {
  https
    .get(
      'https://api.github.com/meta',
      {
        headers: {
          'User-Agent': 'Jade',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          callback(null, JSON.parse(data));
        });
      },
    )
    .on('error', (err) => {
      console.error('Error: ' + err);
      callback(err);
    });
};

getGithubIp = promisify(getGithubIp);

module.exports = { getGithubIp };

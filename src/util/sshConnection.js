const { basename } = require('path');
const { Client } = require('ssh2');
const { join } = require('./fileUtils');
const { jadeLog, jadeErr } = require('./logger');

const withConnection = (host, work) => {
  let conn_;
  return getConnection(host)
    .then((conn) => {
      conn_ = conn;
      return work(conn);
    })
    .then(
      () => {
        if (conn_) conn_.end();
      },
      () => {
        if (conn_) conn_.end();
      },
    );
};

const getConnection = (host) => {
  return new Promise((resolve, reject) => {
    let conn = promisifyConnection(new Client());
    conn
      .on('ready', () => {
        resolve(conn);
      })
      .on('error', (err) => {
        reject(err);
      })
      .connect(host);
  });
};

const putFiles = async (localPaths, remotePath, sftp, conn) => {
  const promises = localPaths.map((localPath) => {
    return new Promise((res) => {
      sftp.fastPut(
        localPath,
        join(remotePath, basename(localPath)),
        {},
        (err) => {
          if (err) throw err;
          res(true);
        },
      );
    });
  });
  jadeLog('Uploading files...');
  await Promise.all(promises)
    .then(() => {
      jadeLog('Files uploaded.');
      conn.end();
    })
    .catch((err) => {
      jadeErr(err);
      conn.end();
    });
};

const promisifyConnection = (conn) => {
  conn.asyncShell = (command) => {
    return new Promise((resolve, reject) => {
      jadeLog('SSH shell commands beginning...');
      conn.shell((err, stream) => {
        if (err) {
          jadeErr(err);
          reject(err);
        } else {
          stream
            .on('error', (err) => {
              reject(err);
            })
            .on('close', (err) => {
              jadeLog('SSH shell commands ended.');
              conn.end();
              err ? reject(err) : resolve();
            })
            .on('data', (d) => {
              const string = d
                .toString('utf8')
                .trim()
                .replace(/\s{2,}/gi, ' ');

              if (string.length > 2 && !/[{}#%\[\]]/gi.test(string)) {
                jadeLog(`OUTPUT: ${string}`);
              }
            });
          stream.end(command);
        }
      });
    });
  };

  conn.asyncSftp = (remotePath, ...localPaths) => {
    return new Promise((resolve, reject) => {
      jadeLog('SFTP beginning...');
      conn.sftp(async (err, sftp) => {
        if (err) {
          jadeErr(err);
          reject(err);
        } else {
          try {
            sftp.readdir(remotePath, {}, async (err, files) => {
              jadeLog('Checking if folder exists...');
              if (err) {
                jadeLog('Making folder...');
                sftp.mkdir(remotePath, {}, async (err) => {
                  if (err) throw err;
                  await putFiles(localPaths, remotePath, sftp, conn);
                  resolve();
                });
              } else {
                await putFiles(localPaths, remotePath, sftp, conn);
                resolve();
              }
            });
          } catch (err) {
            jadeErr(err);
            reject(err);
          }
        }
      });
    });
  };

  return conn;
};

module.exports = { withConnection, getConnection };

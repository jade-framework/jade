const { basename } = require('path');
const { Client } = require('ssh2');
const { join } = require('./fileUtils');

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
  console.log('Uploading files...');
  await Promise.all(promises)
    .then(() => {
      console.log('Files uploaded');
      conn.end();
    })
    .catch((err) => {
      console.log(err);
      conn.end();
    });
};

const promisifyConnection = (conn) => {
  conn.asyncShell = (command) => {
    return new Promise((resolve, reject) => {
      console.log('SSH shell commands beginning...');
      conn.shell((err, stream) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let data = [];
          stream
            .on('error', (err) => {
              reject(err);
            })
            .on('close', (err) => {
              console.log('SSH shell commands ended.');
              conn.end();
              err ? reject(err) : resolve(data);
            })
            .on('data', (d) => {
              console.log(`OUTPUT: ${d}`);
            });
          stream.end(command);
        }
      });
    });
  };

  conn.asyncSftp = (remotePath, ...localPaths) => {
    return new Promise((resolve, reject) => {
      console.log('SFTP beginning...');
      conn.sftp(async (err, sftp) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          try {
            sftp.readdir(remotePath, {}, async (err, files) => {
              console.log('Checking if folder exists...');
              if (err) {
                console.log('Making folder...');
                sftp.mkdir(remotePath, {}, async (err) => {
                  if (err) throw err;
                  await putFiles(localPaths, remotePath, sftp, conn);
                });
              } else {
                await putFiles(localPaths, remotePath, sftp, conn);
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
  };

  return conn;
};

module.exports = { withConnection, getConnection };

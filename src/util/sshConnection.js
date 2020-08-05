const { dirname } = require("path");
const { Client } = require("ssh2");

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
      }
    );
};

const getConnection = (host) => {
  return new Promise((resolve, reject) => {
    let conn = promisifyConnection(new Client());
    conn
      .on("ready", () => {
        resolve(conn);
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect(host);
  });
};

const promisifyConnection = (conn) => {
  conn.asyncShell = (command) => {
    return new Promise((resolve, reject) => {
      console.log("SSH shell commands beginning...");
      conn.shell((err, stream) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let data = [];
          stream
            .on("error", (err) => {
              reject(err);
            })
            .on("close", (err) => {
              console.log("SSH shell commands ended.");
              conn.end();
              err ? reject(err) : resolve(data);
            })
            .on("data", (d) => {
              console.log(`OUTPUT: ${d}`);
            });
          stream.end(command);
        }
      });
    });
  };

  conn.asyncSftp = (remotePath, ...localPaths) => {
    return new Promise((resolve, reject) => {
      console.log("SFTP beginning...");
      conn.sftp((err, sftp) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(remotePath);
          let dirExists;
          sftp.readdir(remotePath, {}, (err, files) => {
            console.log("err", err, files);
            if (err) {
              dirExists = false;
            } else {
              dirExists = true;
            }
          });
          console.log(dirExists);
          if (!dirExists) {
            console.log("Creating directory...");
            sftp.mkdir(remotePath);
          }
          let promises = localPaths.map((path) => {
            console.log(`Adding ${path}`);
            return sftp.fastPut(path, remotePath, {}, (err) => {
              if (err) console.log(err);
            });
          });
          console.log(promises);
          Promise.allSettled(promises).then((res) => {
            conn.end();
            console.log("SFTP ended.");
            resolve(res);
          });
        }
      });
    });
  };

  return conn;
};

module.exports = { withConnection, getConnection };

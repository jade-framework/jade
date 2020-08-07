/**
 * A Lambda function that triggers EC2 to build on receipt of Github webhook
 */

const axios = require('axios');
const { getJadePath, readJSONFile } = require('../../util/fileUtils');
const { cwd } = require('../../templates/constants');

exports.handler = async (event, context, callback) => {
  const jadePath = getJadePath(cwd);
  const ec2Data = await readJSONFile('ec2Instance', jadePath);
  const privateIp = ec2Data.Instances[0].PrivateIpAddress;

  try {
    const response = await axios.post(`http://${privateIp}/webhook`, {
      repo: 'repo',
      bucketName: 'bucketName',
    });
    console.log(event, response);
  } catch (error) {
    console.log(error);
  }
};

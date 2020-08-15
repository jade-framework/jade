const { promisify } = require('util');
const EC2 = require('aws-sdk/clients/ec2');
const { getRegion } = require('../../server/getRegion');
const { jadeLog, jadeErr } = require('../logger');

const apiVersion = 'latest';
const region = getRegion();

const ec2 = new EC2({ apiVersion, region });

async function terminateJadeEc2Instances() {
  const toBeDeleted = [];
  ec2.describeInstances((err, data) => {
    if (err) jadeErr(err);
    for (const item of data.Reservations) {
      for (const instance of item.Instances) {
        for (const tag of instance.Tags) {
          if (tag.Key === 'project' && tag.Value === 'jade') {
            toBeDeleted.push(instance.InstanceId);
          }
        }
      }
    }

    if (toBeDeleted.length > 0) {
      ec2.terminateInstances({ InstanceIds: toBeDeleted }, (err, data) => {
        if (err) jadeErr(err);
        jadeLog(data);
      });
    }
  });
}

module.exports = { terminateJadeEc2Instances };

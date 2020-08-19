const EC2 = require('aws-sdk/clients/ec2');
const { getRegion } = require('../../server/getRegion');
const { jadeLog, jadeErr } = require('../logger');

const apiVersion = 'latest';
const region = getRegion();

const ec2 = new EC2({ apiVersion, region });

const {
  asyncDescribeInstances,
  asyncTerminateInstances,
} = require('../../aws/awsAsyncFunctions');

async function terminateJadeEc2Instances() {
  const toBeDeleted = [];
  const params = {
    Filters: [
      {
        Name: 'tag:project',
        Values: ['jade'],
      },
    ],
  };

  try {
    jadeLog('Getting existing Jade instances...');
    const instances = await asyncDescribeInstances(params);
    for (const item of instances.Reservations) {
      for (const instance of item.Instances) {
        toBeDeleted.push(instance.InstanceId);
      }
    }

    if (toBeDeleted.length > 0) {
      jadeLog(`Terminating ${toBeDeleted.length} instance(s)...`);
      await asyncTerminateInstances({ InstanceIds: toBeDeleted });
      jadeLog(`Jade EC2 instances terminated.`);
    } else {
      jadeLog('No Jade instances detected.');
    }
  } catch (err) {
    jadeErr(err);
  }
  // ec2.describeInstances((err, data) => {
  //   if (err) jadeErr(err);
  //   for (const item of data.Reservations) {
  //     for (const instance of item.Instances) {
  //       for (const tag of instance.Tags) {
  //         if (tag.Key === 'project' && tag.Value === 'jade') {
  //           toBeDeleted.push(instance.InstanceId);
  //         }
  //       }
  //     }
  //   }

  //   if (toBeDeleted.length > 0) {
  //     ec2.terminateInstances({ InstanceIds: toBeDeleted }, (err, data) => {
  //       if (err) jadeErr(err);
  //       jadeLog('EC2 instances terminated.');
  //     });
  //   }
  // });
}

module.exports = { terminateJadeEc2Instances };
// (async () => {
//   await terminateJadeEc2Instances();
// })();

const { promisify } = require("util");
const EC2 = require("aws-sdk/clients/ec2");
const { getRegion } = require("../../src/util/getRegion");

const apiVersion = "latest";
const region = getRegion();

const ec2 = new EC2({ apiVersion, region });

module.exports = function () {
  const toBeDeleted = [];
  ec2.describeInstances((err, data) => {
    if (err) throw err;
    for (const item of data.Reservations) {
      for (const instance of item.Instances) {
        for (const tag of instance.Tags) {
          if (tag.Key === "Name" && tag.Value === "Jade EC2 Instance") {
            toBeDeleted.push(instance.InstanceId);
          }
        }
      }
    }
  });

  if (toBeDeleted.length > 0) {
    ec2.terminateInstances({ InstanceIds: toBeDeleted }, (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  }
};

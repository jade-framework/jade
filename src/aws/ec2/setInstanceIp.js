const { asyncDescribeInstances } = require("../awsAsyncFunctions");

const {
  getJadePath,
  readJSONFile,
  createJSONFile,
} = require("../../util/fileUtils");

const { hostDirectory } = require("../../constants/allConstants");

const getInstanceData = async (instanceId) => {
  const describeInstancesResponse = await asyncDescribeInstances({
    InstanceIds: [instanceId],
  });

  return describeInstancesResponse.Reservations[0].Instances[0];
};

async function setInstanceIp() {
  const path = getJadePath(hostDirectory);
  try {
    console.log("Fetching EC2 instance public IP...");
    const ec2Data = await readJSONFile("ec2Instance", path);
    const instanceId = ec2Data.Instances[0].InstanceId;
    const instanceData = await getInstanceData(instanceId);

    await createJSONFile("ec2Instance", path, {
      ...ec2Data,
      Instances: [instanceData],
    });
    console.log("EC2 public IP fetched.");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { setInstanceIp };

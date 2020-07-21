const path = require("path");
const { asyncRunInstances } = require("./index");

const {
  createJSONFile,
  getJadePath,
  readJSONFile,
} = require("../../util/fileUtils");

const { hostDirectory } = require("../../constants/allConstants");

const {
  amazonMachineImageId,
  instanceType,
} = require("../../constants/allConstants");

const createSecurityGroup = require("./createSecurityGroup");
const createKeyPair = require("./createKeyPair");

const runInstancesParams = {
  ImageId: amazonMachineImageId,
  InstanceType: instanceType,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: [
    {
      ResourceType: "instance",
      Tags: [
        {
          Key: "Name",
          Value: "Jade EC2 Instance",
        },
      ],
    },
  ],
};

module.exports = async function createEC2Instance() {
  const jadePath = getJadePath(hostDirectory);
  try {
    console.log("Creating Jade security group...");
    await createSecurityGroup();
    console.log("Creating Jade key pair and .pem file...");
    await createKeyPair();
    const keyPair = await readJSONFile("keyPair", jadePath);
    const securityGroup = await readJSONFile("securityGroup", jadePath);

    console.log("Reading IAM instance profile...");
    const instanceProfile = await readJSONFile("ec2InstanceProfile", jadePath);
    const instanceProfileArn = instanceProfile.InstanceProfile.Arn;
    console.log(instanceProfileArn);

    console.log("Creating EC2 instance...");
    const runInstancesResponse = await asyncRunInstances({
      ...runInstancesParams,
      KeyName: keyPair.KeyName,
      IamInstanceProfile: {
        Arn: instanceProfileArn,
      },
      SecurityGroupIds: [securityGroup.GroupId],
    });

    await createJSONFile("ec2Instance", jadePath, runInstancesResponse);
    console.log("Jade EC2 server successfully setup.");
  } catch (err) {
    console.log(err);
  }
};

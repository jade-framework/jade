const {
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncWaitFor,
} = require("./index");

const {
  createJSONFile,
  exists,
  join,
  getJadePath,
  readJSONFile,
} = require("../../util/fileUtils");

const { hostDirectory } = require("../../constants/allConstants");

const {
  instanceType,
  securityGroup,
  keyPair,
} = require("../../constants/allConstants");

const getAmi = require("./getAmi");

const createSecurityGroup = require("./createSecurityGroup");
const createKeyPair = require("./createKeyPair");

const runInstancesParams = {
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
    if (!(await exists(join(jadePath, `${securityGroup}.json`)))) {
      console.log("Creating Jade security group...");
      await createSecurityGroup();
    }
    if (!(await exists(join(jadePath, `${keyPair}.json`)))) {
      console.log("Creating Jade key pair and .pem file...");
      await createKeyPair();
    }
    const securityGroupData = await readJSONFile(securityGroup, jadePath);
    const keyPairData = await readJSONFile(keyPair, jadePath);

    console.log("Reading IAM instance profile...");
    const instanceProfile = await readJSONFile("ec2InstanceProfile", jadePath);
    const instanceProfileArn = instanceProfile.InstanceProfile.Arn;

    console.log("Creating EC2 instance...");
    const runInstancesResponse = await asyncRunInstances({
      ...runInstancesParams,
      ImageId: await getAmi(),
      KeyName: keyPairData.KeyName,
      SecurityGroupIds: [securityGroupData.GroupId],
    });

    await createJSONFile("ec2Instance", jadePath, runInstancesResponse);
    const InstanceId = runInstancesResponse.Instances[0].InstanceId;

    console.log("Waiting for EC2 instance to start running...");
    await asyncWaitFor("instanceRunning", { InstanceIds: [InstanceId] });

    console.log("Associating IAM instance profile with EC2 instance...");
    await asyncAssociateIamInstanceProfile({
      IamInstanceProfile: {
        Arn: instanceProfileArn,
      },
      InstanceId,
    });

    console.log("Jade EC2 instance successfully setup.");
  } catch (err) {
    console.log(err);
  }
};

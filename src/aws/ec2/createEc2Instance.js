const {
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncEc2WaitFor,
} = require('../awsAsyncFunctions');

const {
  createJSONFile,
  getJadePath,
  readJSONFile,
} = require('../../util/fileUtils');

const {
  cwd,
  instanceType,
  securityGroup,
  keyPair,
} = require('../../templates/constants');

const { getAmi } = require('./getAmi');

const runInstancesParams = (projectName) => ({
  InstanceType: instanceType,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: [
    {
      ResourceType: 'instance',
      Tags: [
        {
          Key: 'project',
          Value: 'jade',
        },
        {
          Key: 'Name',
          Value: `${projectName}'s Jade EC2 Instance`,
        },
      ],
    },
  ],
});

const getInstanceData = async (instanceId) => {
  const describeInstancesResponse = await asyncDescribeInstances({
    InstanceIds: [instanceId],
  });

  return describeInstancesResponse.Reservations[0].Instances[0];
};

const createEc2Instance = async (projectName) => {
  const jadePath = getJadePath(cwd);
  try {
    const securityGroupData = await readJSONFile(securityGroup, jadePath);
    const keyPairData = await readJSONFile(keyPair, jadePath);

    console.log('Reading IAM instance profile...');
    const instanceProfile = await readJSONFile('ec2InstanceProfile', jadePath);
    const instanceProfileArn = instanceProfile.InstanceProfile.Arn;

    console.log('Creating EC2 instance...');
    const runInstancesResponse = await asyncRunInstances({
      ...runInstancesParams(projectName),
      ImageId: await getAmi(),
      KeyName: keyPairData.KeyName,
      SecurityGroupIds: [securityGroupData.SecurityGroups[0].GroupId],
    });

    await createJSONFile('ec2Instance', jadePath, runInstancesResponse);
    const instanceId = runInstancesResponse.Instances[0].InstanceId;

    console.log('Waiting for EC2 instance to start running...');
    await asyncEc2WaitFor('instanceRunning', { InstanceIds: [instanceId] });

    console.log('Associating IAM instance profile with EC2 instance...');
    await asyncAssociateIamInstanceProfile({
      IamInstanceProfile: {
        Arn: instanceProfileArn,
      },
      InstanceId: instanceId,
    });

    console.log('Jade EC2 instance successfully configured.');
    const instanceData = await getInstanceData(instanceId);
    console.log('EC2 public IP fetched.');
    return instanceData;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createEc2Instance };

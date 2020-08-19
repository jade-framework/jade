const {
  asyncRunInstances,
  asyncAssociateIamInstanceProfile,
  asyncDescribeInstances,
  asyncEc2WaitFor,
} = require('../awsAsyncFunctions');

const { jadeLog, jadeErr } = require('../../util/logger');
const { instanceType, jadeKeyPair } = require('../../templates/constants');
const { tagName } = require('../../util/helpers');
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
          Value: tagName(projectName),
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

const createEc2Instance = async (projectData) => {
  const { projectName, instanceProfile, securityGroup } = projectData;
  try {
    jadeLog('Reading IAM instance profile...');
    const instanceProfileArn = instanceProfile.Arn;

    jadeLog('Creating EC2 instance...');
    const runInstancesResponse = await asyncRunInstances({
      ...runInstancesParams(projectName),
      ImageId: await getAmi(),
      KeyName: jadeKeyPair,
      SecurityGroupIds: [securityGroup.SecurityGroups[0].GroupId],
    });

    const instance = runInstancesResponse.Instances.find((el) => {
      const match = el.Tags.find((tag) => tag.Value === tagName(projectName));
      if (match) return true;
    });
    const instanceId = instance.InstanceId;

    jadeLog('Waiting for EC2 instance to start running...');
    await asyncEc2WaitFor('instanceRunning', { InstanceIds: [instanceId] });

    jadeLog('Associating IAM instance profile with EC2 instance...');
    await asyncAssociateIamInstanceProfile({
      IamInstanceProfile: {
        Arn: instanceProfileArn,
      },
      InstanceId: instanceId,
    });

    jadeLog('Jade EC2 instance successfully configured.');
    const instanceData = await getInstanceData(instanceId);
    jadeLog('EC2 public IP fetched.');
    projectData.publicIp = instanceData.PublicIpAddress;
    return true;
  } catch (err) {
    jadeErr(err);
  }
};

module.exports = { createEc2Instance };

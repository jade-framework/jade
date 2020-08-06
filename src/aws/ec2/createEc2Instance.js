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

const runInstancesParams = {
  InstanceType: instanceType,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: [
    {
      ResourceType: 'instance',
      Tags: [
        {
          Key: 'Name',
          Value: 'Jade EC2 Instance',
        },
      ],
    },
  ],
};

const createEc2Instance = async () => {
  const jadePath = getJadePath(cwd);
  try {
    const securityGroupData = await readJSONFile(securityGroup, jadePath);
    const keyPairData = await readJSONFile(keyPair, jadePath);

    console.log('Reading IAM instance profile...');
    const instanceProfile = await readJSONFile('ec2InstanceProfile', jadePath);
    const instanceProfileArn = instanceProfile.InstanceProfile.Arn;

    console.log('Creating EC2 instance...');
    const runInstancesResponse = await asyncRunInstances({
      ...runInstancesParams,
      ImageId: await getAmi(),
      KeyName: keyPairData.KeyName,
      SecurityGroupIds: [securityGroupData.GroupId],
    });

    await createJSONFile('ec2Instance', jadePath, runInstancesResponse);
    const InstanceId = runInstancesResponse.Instances[0].InstanceId;

    console.log('Waiting for EC2 instance to start running...');
    await asyncEc2WaitFor('instanceRunning', { InstanceIds: [InstanceId] });

    console.log('Associating IAM instance profile with EC2 instance...');
    await asyncAssociateIamInstanceProfile({
      IamInstanceProfile: {
        Arn: instanceProfileArn,
      },
      InstanceId,
    });

    console.log('Jade EC2 instance successfully setup.');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createEc2Instance };

const amazonMachineImageId = "ami-04122be15033aa7ec";
const instanceType = "t2.micro";
const hostDirectory = process.cwd();
const keyPair = "keyPair";
const privateKeyFilename = "jade-key-pair.pem";
const securityGroup = "securityGroup";
const ec2IamRoleName = "jade-ec2-role";
const ec2InstanceProfile = "jade-ec2-instance-profile";

module.exports = {
  amazonMachineImageId,
  instanceType,
  hostDirectory,
  keyPair,
  privateKeyFilename,
  securityGroup,
  ec2IamRoleName,
  ec2InstanceProfile,
};

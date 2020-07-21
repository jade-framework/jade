const amazonMachineImageId = "ami-04122be15033aa7ec";
const instanceType = "t2.micro";
const hostDirectory = process.cwd();
const keyPairFilename = "jade-key-pair.pem";
const ec2IamRoleName = "jade-ec2-role";
const ec2InstanceProfile = "jade-ec2-instance-profile";

module.exports = {
  amazonMachineImageId,
  instanceType,
  hostDirectory,
  keyPairFilename,
  ec2IamRoleName,
  ec2InstanceProfile,
};

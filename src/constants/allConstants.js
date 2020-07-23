const amazonMachineImageId = "ami-04122be15033aa7ec";
const instanceType = "t2.micro";
const hostDirectory = process.cwd();
const keyPair = "keyPair";
const privateKeyFilename = "jade-key-pair.pem";
const jadeKeyPair = "jade-key-pair";
const securityGroup = "securityGroup";
const securityGroupName = "jade-security-group";
const ec2IamRoleName = "jade-ec2-role";
const ec2InstanceProfile = "jade-ec2-instance-profile";
const s3FullAccessPolicyArn = "arn:aws:iam::aws:policy/AmazonS3FullAccess";

module.exports = {
  amazonMachineImageId,
  instanceType,
  hostDirectory,
  jadeKeyPair,
  keyPair,
  privateKeyFilename,
  securityGroup,
  securityGroupName,
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
};

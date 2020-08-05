const cwd = process.cwd();

const instanceType = "t2.micro";
const keyPair = "keyPair";
const privateKeyFilename = "jade-key-pair.pem";
const jadeKeyPair = "jade-key-pair";
const securityGroup = "securityGroup";
const securityGroupName = "jade-security-group";
const ec2IamRoleName = "jade-ec2-role";
const ec2InstanceProfile = "jade-ec2-instance-profile";
const s3FullAccessPolicyArn = "arn:aws:iam::aws:policy/AmazonS3FullAccess";
const lambdaIamRoleName = "lambda-s3-role-2";
const awsLambdaExecutePolicyArn = "arn:aws:iam::aws:policy/AWSLambdaExecute";
const awsLambdaRolePolicyArn =
  "arn:aws:iam::aws:policy/service-role/AWSLambdaRole";
const lambdaFunctionName = "copyToBucket";
const jadePrefix = "\x1b[32;1m💎\x1b[32;0m";

module.exports = {
  instanceType,
  cwd,
  jadeKeyPair,
  keyPair,
  privateKeyFilename,
  securityGroup,
  securityGroupName,
  ec2IamRoleName,
  ec2InstanceProfile,
  s3FullAccessPolicyArn,
  lambdaIamRoleName,
  awsLambdaExecutePolicyArn,
  awsLambdaRolePolicyArn,
  lambdaFunctionName,
  jadePrefix,
};

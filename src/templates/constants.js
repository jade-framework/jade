const cwd = process.cwd();

const instanceType = 't2.micro';
const keyPair = 'keyPair';
const privateKeyFilename = 'jade-key-pair.pem';
const jadeKeyPair = 'jade-key-pair';
const securityGroup = 'securityGroup';
const securityGroupName = 'jade-security-group';
const ec2IamRoleName = 'jade-ec2-role';
const ec2InstanceProfile = 'jade-ec2-instance-profile';
const s3FullAccessPolicyArn = 'arn:aws:iam::aws:policy/AmazonS3FullAccess';
const lambdaIamRoleName = 'jade-lambda-role';
const awsLambdaExecutePolicyArn = 'arn:aws:iam::aws:policy/AWSLambdaExecute';
const awsLambdaRolePolicyArn =
  'arn:aws:iam::aws:policy/service-role/AWSLambdaRole';
const jadePrefix = '\x1b[32;1m💎\x1b[32;0m';
const lambdaNames = 'jadeInvalidateCloudfrontFile';
const lambdaRolePolicies = [
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaExecute',
  'arn:aws:iam::aws:policy/service-role/AWSLambdaRole',
];
const s3BucketName = 's3BucketName';
const gitRepos = ['GitHub', 'GitLab', 'Bitbucket'];

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
  jadePrefix,
  lambdaNames,
  lambdaRolePolicies,
  s3BucketName,
  gitRepos,
};

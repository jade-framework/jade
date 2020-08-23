const cwd = process.cwd();

const instanceType = 't2.micro';
const keyPair = 'keyPair';
const privateKeyFilename = 'jade-key-pair.pem';
const jadeKeyPair = 'jade-key-pair';
const jadeIamGroup = 'jade-iam-group';
const securityGroup = 'securityGroup';
const securityGroupName = 'jade-security-group';
const ec2IamRoleName = 'jade-ec2-role';
const ec2InstanceProfile = 'jade-ec2-instance-profile';
const ec2RolePolicies = [
  'arn:aws:iam::aws:policy/AmazonS3FullAccess',
  'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
];
const lambdaIamRoleName = 'jade-lambda-role';
const jadePrefix = '\x1b[32;1m💎\x1b[32;0m';
const lambdaNames = 'jadeInvalidateCloudFrontFile';
const lambdaRolePolicies = [
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
];
const initialProjectData = 'initialProjectData';
const projectNameLength = 24;
const bucketSuffixes = ['prod', 'builds', 'lambda', 'stage']; // production/live is always first, builds/history is always second
const cloudFrontOriginId = (name) => `S3-${name}`;
const cloudFrontOriginDomain = (name) =>
  `${name}-${bucketSuffixes[0]}.s3.amazonaws.com`;
const appsTableName = 'JadeProjects';
const versionsTableName = 'JadeProjectsVersions';

module.exports = {
  cwd,
  instanceType,
  keyPair,
  jadeKeyPair,
  jadeIamGroup,
  privateKeyFilename,
  securityGroup,
  securityGroupName,
  ec2IamRoleName,
  ec2InstanceProfile,
  ec2RolePolicies,
  lambdaIamRoleName,
  lambdaNames,
  lambdaRolePolicies,
  jadePrefix,
  initialProjectData,
  projectNameLength,
  bucketSuffixes,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
  appsTableName,
  versionsTableName,
};

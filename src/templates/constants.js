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
const s3FullAccessPolicyArn = 'arn:aws:iam::aws:policy/AmazonS3FullAccess';
const lambdaIamRoleName = 'jade-lambda-role';
const jadePrefix = '\x1b[32;1m💎\x1b[32;0m';
const lambdaNames = 'jadeInvalidateCloudFrontFile';
const lambdaRolePolicies = [
  'arn:aws:iam::aws:policy/CloudFrontFullAccess',
  'arn:aws:iam::aws:policy/AWSLambdaFullAccess',
];
const s3BucketName = 's3BucketName';
const projectNameLength = 24;
const bucketSuffixes = ['prod', 'builds', 'lambda', 'stage']; // production/live is always first, builds/history is always second
const cloudFrontOriginId = (name) => `S3-${name}`;
const cloudFrontOriginDomain = (name) => {
  return `${name}-${bucketSuffixes[0]}.s3.amazonaws.com`;
};

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
  s3FullAccessPolicyArn,
  lambdaIamRoleName,
  jadePrefix,
  lambdaNames,
  lambdaRolePolicies,
  s3BucketName,
  projectNameLength,
  bucketSuffixes,
  cloudFrontOriginId,
  cloudFrontOriginDomain,
};

const {
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
} = require('../awsAsyncFunctions');

const {
  exists,
  join,
  createJSONFile,
  readJSONFile,
  getJadePath,
} = require('../../util/fileUtils');

const {
  cwd,
  securityGroup,
  securityGroupName,
} = require('../../templates/constants');

const getGithubIp = require('../../github/getGithubIp');

// default data
const securityGroupParams = {
  GroupName: securityGroupName,
  Description: 'Security Group to configure EC2 instances',
  TagSpecifications: [
    {
      ResourceType: 'security-group',
      Tags: [{ Key: 'Name', Value: securityGroupName }],
    },
  ],
};

const setIngressHookRules = (policy, addresses, description) => {
  const ipRanges = addresses.map((address) => ({
    CidrIp: address,
    Description: description,
  }));
  const permissions = {
    FromPort: 80,
    IpProtocol: 'tcp',
    IpRanges: ipRanges,
    ToPort: 80,
  };
  policy.IpPermissions.push(permissions);
};

const setIngressSshRule = (policy) => {
  const permission = {
    // Allow SSH
    FromPort: 22,
    IpProtocol: 'tcp',
    IpRanges: [
      {
        CidrIp: '0.0.0.0/0',
      },
    ],
    ToPort: 22,
  };
  policy.IpPermissions.push(permission);
};

const createSecurityGroup = async () => {
  const jadePath = getJadePath(cwd);
  let ingressRules = { IpPermissions: [] };

  try {
    const Filters = [{ Name: 'tag:Name', Values: [`${securityGroupName}`] }];
    let jadeSecurityGroups = await asyncDescribeSecurityGroups({
      Filters,
    });
    if (
      jadeSecurityGroups.SecurityGroups &&
      jadeSecurityGroups.SecurityGroups.length > 0
    ) {
      console.log('Jade security group already exists.');
    } else {
      console.log('Creating Jade security group...');
      const securityGroupResponse = await asyncCreateSecurityGroup(
        securityGroupParams,
      );

      console.log('Whitelisting Github IP addresses...');
      const githubIps = await getGithubIp();
      await createJSONFile('githubApi', jadePath, githubIps);
      const githubIpAddresses = await readJSONFile('githubApi', jadePath);
      const githubHookIps = githubIpAddresses.hooks;
      const githubRuleDesc = 'Github hook address';
      setIngressSshRule(ingressRules);
      setIngressHookRules(ingressRules, githubHookIps, githubRuleDesc);

      ingressRules = {
        ...ingressRules,
        GroupId: securityGroupResponse.GroupId,
      };

      console.log('Setting security group ingress rules...');
      await asyncAuthorizeSecurityGroupIngress(ingressRules);

      jadeSecurityGroups = await asyncDescribeSecurityGroups({
        Filters,
      });
    }
    console.log('Saving security group data as JSON...');
    await createJSONFile(securityGroup, jadePath, jadeSecurityGroups);
    console.log('Jade security group done.');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createSecurityGroup };

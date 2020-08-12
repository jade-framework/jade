const {
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
} = require('../awsAsyncFunctions');

const { getJadePath } = require('../../util/fileUtils');
const { jadeLog, jadeErr } = require('../../util/logger');

const { cwd, securityGroupName } = require('../../templates/constants');

const { getGithubIp } = require('../../util/getGithubIp');

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

const createSecurityGroup = async (projectData) => {
  const jadePath = getJadePath(cwd);
  let ingressRules = { IpPermissions: [] };

  try {
    const Filters = [{ Name: 'tag:Name', Values: [securityGroupName] }];
    let jadeSecurityGroups = await asyncDescribeSecurityGroups({
      Filters,
    });
    if (
      jadeSecurityGroups.SecurityGroups &&
      jadeSecurityGroups.SecurityGroups.length > 0
    ) {
      jadeLog('Jade security group already exists.');
    } else {
      jadeLog('Creating Jade security group...');
      const securityGroupResponse = await asyncCreateSecurityGroup(
        securityGroupParams,
      );

      jadeLog('Whitelisting Github IP addresses...');
      const githubIps = await getGithubIp();
      console.log(`githubIps are ${githubIps}`);
      const githubHookIps = githubIps.hooks;
      const githubRuleDesc = 'Github hook address';
      setIngressSshRule(ingressRules);
      setIngressHookRules(ingressRules, githubHookIps, githubRuleDesc);

      ingressRules = {
        ...ingressRules,
        GroupId: securityGroupResponse.GroupId,
      };

      jadeLog('Setting security group ingress rules...');
      await asyncAuthorizeSecurityGroupIngress(ingressRules);

      jadeSecurityGroups = await asyncDescribeSecurityGroups({
        Filters,
      });
    }
    projectData.securityGroup = jadeSecurityGroups;
    jadeLog('Jade security group done.');
    return true;
  } catch (err) {
    jadeErr(err);
    return false;
  }
};

module.exports = { createSecurityGroup };

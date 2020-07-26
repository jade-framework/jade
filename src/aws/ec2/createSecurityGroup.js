const {
  asyncCreateSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncAuthorizeSecurityGroupIngress,
} = require("../awsAsyncFunctions");

const {
  exists,
  join,
  createJSONFile,
  readJSONFile,
  getJadePath,
} = require("../../util/fileUtils");

const {
  hostDirectory,
  securityGroup,
  securityGroupName,
} = require("../../constants/allConstants");

const getGithubIp = require("../../github/getGithubIp");

// default data
const securityGroupParams = {
  GroupName: securityGroupName,
  Description: "Security Group to configure EC2 instances",
  TagSpecifications: [
    {
      ResourceType: "security-group",
      Tags: [{ Key: "Name", Value: securityGroupName }],
    },
  ],
};

const setIngressHookRules = (policy, addresses) => {
  const ipRanges = addresses.map((address) => ({
    CidrIp: address,
    Description: "Github hook address",
  }));
  const permissions = {
    FromPort: 80,
    IpProtocol: "tcp",
    IpRanges: ipRanges,
    ToPort: 80,
  };
  policy.IpPermissions.push(permissions);
};

const setIngressSshRule = (policy) => {
  const permission = {
    // Allow SSH
    FromPort: 22,
    IpProtocol: "tcp",
    IpRanges: [
      {
        CidrIp: "0.0.0.0/0",
      },
    ],
    ToPort: 22,
  };
  policy.IpPermissions.push(permission);
};

const createSecurityGroup = async () => {
  const jadePath = getJadePath(hostDirectory);
  let ingressRules = { IpPermissions: [] };

  try {
    const Filters = [{ Name: "tag:Name", Values: [`${securityGroupName}`] }];
    const jadeSecurityGroups = await asyncDescribeSecurityGroups({
      Filters,
    });
    if (
      jadeSecurityGroups.SecurityGroups &&
      jadeSecurityGroups.SecurityGroups.length > 0
    ) {
      console.log("Jade security group already exists.");
    } else {
      console.log("Creating Jade security group...");
      const securityGroupResponse = await asyncCreateSecurityGroup(
        securityGroupParams
      );

      console.log("Getting Github IP addresses...");
      const githubIps = await getGithubIp();
      await createJSONFile("githubApi", jadePath, githubIps);
      const githubIpAddresses = await readJSONFile("githubApi", jadePath);
      const githubHookIps = githubIpAddresses.hooks;
      setIngressSshRule(ingressRules);
      setIngressHookRules(ingressRules, githubHookIps);
      ingressRules = {
        ...ingressRules,
        GroupId: securityGroupResponse.GroupId,
      };

      console.log("Setting security group ingress rules...");
      const ingressRulesResponse = await asyncAuthorizeSecurityGroupIngress(
        ingressRules
      );
      await createJSONFile(securityGroup, jadePath, {
        ...securityGroupParams,
        ...securityGroupResponse,
        ...ingressRulesResponse,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createSecurityGroup };

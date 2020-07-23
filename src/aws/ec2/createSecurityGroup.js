const {
  asyncCreateSecurityGroup,
  asyncAuthorizeSecurityGroupIngress,
} = require("./index");

const {
  createJSONFile,
  readJSONFile,
  getJadePath,
} = require("../../util/fileUtils");

const { hostDirectory } = require("../../constants/allConstants");

const getGithubIp = require("../../github/getGithubIp");

// default data
const securityGroupParams = {
  GroupName: "jade-security-group",
  Description: "Security Group to configure EC2 instances",
};

const setIngressHookRules = (policy, addresses) => {
  const ipRanges = addresses.map((address) => ({
    CidrIp: address,
    Description: "Github hook address",
  }));
  const permissions = {
    FromPort: 80,
    InProtocol: "tcp",
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

// module.exports =
async function createSecurityGroup() {
  const jadePath = getJadePath(hostDirectory);
  let ingressRules = { IpPermissions: [] };

  try {
    const securityGroupResponse = await asyncCreateSecurityGroup(
      securityGroupParams
    );

    await createJSONFile("securityGroup", jadePath, {
      ...securityGroupParams,
      ...securityGroupResponse,
    });

    await getGithubIp();
    const githubIpAddresses = await readJSONFile("githubApi", jadePath);
    const githubHookIp = githubIpAddresses.hooks;
    setIngressSshRule(ingressRules);
    setIngressHookRules(ingressRules, githubHookIp);

    ingressRules = { ...ingressRules, GroupId: securityGroupResponse.GroupId };
    await asyncAuthorizeSecurityGroupIngress(ingressRules);
  } catch (err) {
    console.log(err);
  }
}

createSecurityGroup();

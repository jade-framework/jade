const {
  asyncCreateSecurityGroup,
  asyncAuthorizeSecurityGroupIngress,
} = require("./index");

const { createJSONFile, getJadePath } = require("../../util/fileUtils");

const { hostDirectory } = require("../../constants/allConstants");

// default data
const securityGroupParams = {
  GroupName: "jade-security-group",
  Description: "Security Group to configure EC2 instances",
};

let ingressRules = {
  IpPermissions: [
    {
      // Only allow SSH
      FromPort: 22,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 22,
    },
  ],
};

module.exports = async function createSecurityGroup() {
  const jadePath = getJadePath(hostDirectory);
  try {
    const securityGroupResponse = await asyncCreateSecurityGroup(
      securityGroupParams
    );

    await createJSONFile("securityGroup", jadePath, {
      ...securityGroupParams,
      ...securityGroupResponse,
    });

    ingressRules = { ...ingressRules, GroupId: securityGroupResponse.GroupId };
    await asyncAuthorizeSecurityGroupIngress(ingressRules);
  } catch (err) {
    console.log(err);
  }
};

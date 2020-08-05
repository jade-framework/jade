const {
  asyncCreateRole,
  asyncAttachRolePolicy,
  asyncCreateInstanceProfile,
  asyncAddRoleToProfile,
} = require("../awsAsyncFunctions");

const {
  ec2IamRoleName,
  ec2InstanceProfile,
  cwd,
  s3FullAccessPolicyArn,
} = require("../../templates/constants");

const {
  join,
  getJadePath,
  createJSONFile,
  readJSONFile,
} = require("../../util/fileUtils");

const path = require("path");

async function configEc2IamRole() {
  const jadePath = getJadePath(cwd);
  try {
    const rolePolicy = await readJSONFile(
      "ec2IamConfig",
      join(path.resolve(path.dirname(".")), "src", "templates") // hardcoded
    );

    console.log("Creating new role...");
    const createRoleResponse = await asyncCreateRole({
      AssumeRolePolicyDocument: JSON.stringify(rolePolicy),
      RoleName: ec2IamRoleName,
      Tags: [{ Key: "Name", Value: ec2IamRoleName }],
    });
    await createJSONFile("ec2Role", jadePath, createRoleResponse);

    console.log("Attaching S3 role policy...");
    await asyncAttachRolePolicy({
      PolicyArn: s3FullAccessPolicyArn,
      RoleName: ec2IamRoleName,
    });

    console.log("Creating instance profile...");
    const createInstanceResponse = await asyncCreateInstanceProfile({
      InstanceProfileName: ec2InstanceProfile,
    });

    await createJSONFile(
      "ec2InstanceProfile",
      jadePath,
      createInstanceResponse
    );

    console.log("Adding role to instance profile...");
    await asyncAddRoleToProfile({
      InstanceProfileName: ec2InstanceProfile,
      RoleName: ec2IamRoleName,
    });
    console.log("Jade instance profile for EC2 created.");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { configEc2IamRole };

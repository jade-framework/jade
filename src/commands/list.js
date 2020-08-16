const { jadeLog, jadeErr } = require('../util/logger');
const { asyncDynamoScan } = require('../aws/awsAsyncFunctions');
const { appsTableName } = require('../templates/constants');

const printItems = (items) => {
  const projectNameHeader = 'Project Name';
  const domainNameHeader = 'Domain Name';
  const publicIpHeader = 'Webhook endpoint';
  let projectNameLength = projectNameHeader.length;
  let domainNameLength = domainNameHeader.length;
  let publicIpLength = publicIpHeader.length;
  items = items.map((item) => {
    const projectName = item.projectName.S;
    const domainName = item.cloudFrontDomainName.S;
    const publicIp = item.publicIp.S;

    if (projectName.length > projectNameLength) {
      projectNameLength = projectName.length;
    }
    if (domainName.length > domainNameLength) {
      domainNameLength = domainName.length;
    }
    if (publicIp.length > publicIpLength) {
      publicIpLength = publicIp.length + 'http://'.length;
    }
    return { projectName, domainName, publicIp };
  });

  jadeLog(
    `${projectNameHeader.padEnd(projectNameLength)} | ${domainNameHeader.padEnd(
      domainNameLength,
    )} | ${publicIpHeader.padEnd(publicIpLength)}`,
  );
  items.forEach(({ projectName, domainName, publicIp }) => {
    jadeLog(
      `${projectName.padEnd(projectNameLength)} | ${domainName.padEnd(
        domainNameLength,
      )} | http://${publicIp.padEnd(publicIpLength)}`,
    );
  });
};

const list = async () => {
  const params = {
    TableName: appsTableName,
  };
  try {
    const apps = await asyncDynamoScan(params);

    if (apps.Items.length > 0) {
      jadeLog('Here are your current apps:');
      printItems(apps.Items);
    } else {
      jadeLog('You do not have any Jade apps at present.');
    }
  } catch (err) {
    jadeErr(
      `Jade cannot find your DynamoDB data, please ensure you have run "jade init" and you have access to your AWS account.`,
    );
  }
};

module.exports = { list };

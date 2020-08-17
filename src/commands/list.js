const { jadeLog, jadeErr } = require('../util/logger');
const { asyncDynamoScan } = require('../aws/awsAsyncFunctions');
const { appsTableName } = require('../templates/constants');

const printItems = (items) => {
  let count = 0;
  const projectNameHeader = 'Project Name';
  const domainNameHeader = 'Domain Name';
  const publicIpHeader = 'Webhook endpoint';
  const deletedHeader = 'Deleted?';
  const frozenHeader = 'Frozen?';
  let countLength = count.toString().length;
  let projectNameLength = projectNameHeader.length;
  let domainNameLength = domainNameHeader.length;
  let publicIpLength = publicIpHeader.length;
  let deletedLength = deletedHeader.length;
  let frozenLength = frozenHeader.length;

  items = items.map((item) => {
    const projectName = item.projectName.S;
    const domainName = item.cloudFrontDomainName.S;
    const publicIp = item.publicIp.S;
    const active = item.isActive.BOOL ? 'No' : 'Yes';
    const frozen = item.isFrozen.BOOL ? 'Yes' : 'No';
    if (projectName.length > projectNameLength) {
      projectNameLength = projectName.length;
    }
    if (domainName.length > domainNameLength) {
      domainNameLength = domainName.length;
    }
    const itemPublicIpLength = publicIp.length + 'http://'.length;
    if (itemPublicIpLength > publicIpLength) {
      publicIpLength = itemPublicIpLength;
    }
    count++;
    const newCount = count.toString().length;
    if (newCount > countLength) {
      countLength = newCount;
    }
    return { id: count, projectName, domainName, publicIp, active, frozen };
  });

  jadeLog(
    `${'#'.padEnd(countLength)} | ${projectNameHeader.padEnd(
      projectNameLength,
    )} | ${domainNameHeader.padEnd(domainNameLength)} | ${publicIpHeader.padEnd(
      publicIpLength,
    )} | ${deletedHeader.padEnd(deletedLength)} | ${frozenHeader.padEnd(
      frozenLength,
    )}`,
  );
  items.forEach(({ id, projectName, domainName, publicIp, active, frozen }) => {
    const ip = `http://${publicIp}`;
    jadeLog(
      `${id.toString().padEnd(countLength)} | ${projectName.padEnd(
        projectNameLength,
      )} | ${domainName.padEnd(domainNameLength)} | ${ip.padEnd(
        publicIpLength,
      )} | ${active.padEnd(deletedLength)} | ${frozen.padEnd(frozenLength)}`,
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

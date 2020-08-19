const { getHost, sendCommands } = require('./connect');

(async ({ publicIp }) => {
  const host = await getHost({ publicIp });
  const commands = ['cat /home/ec2-user/server/deleteCron | crontab -'];
  await sendCommands(host, commands);
})({ publicIp: '3.8.158.82' });

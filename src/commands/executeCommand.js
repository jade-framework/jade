const { init } = require('./init');

const commandIsBlank = (cmd) => cmd === undefined || cmd === '';
const commandIsHelp = (cmd) => cmd === 'help' || cmd === '-h' || cmd === 'man';

const executeCommand = async (command, args, homedir) => {
  if (command === 'init') {
    await init(homedir);
  } else if (commandIsHelp(command) || commandIsBlank(command)) {
    // await help(args);
    console.log(`Help method, command is ${command}, args is ${args}.`);
  } else {
    console.log(`Command ${command} is not valid.`);
  }
};

module.exports = { executeCommand };

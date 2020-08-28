const { executeCommand } = require('../src/commands/executeCommand');

const [, , command, ...args] = process.argv;
const cwd = process.cwd();

(async () => {
  try {
    await executeCommand(command, args, cwd);
  } catch (err) {
    console.log(err);
  }
})();

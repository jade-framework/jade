const Logger = require('logplease');
const logger = Logger.create('server', { filename: 'logger.log' });

const log = (...msg) => logger.log(msg);

const logErr = (...msg) => logger.error(msg);

// module.exports = { log, logErr };

logger.log('asdf', 'bsdc');

const Logger = require('logplease');
const logger = Logger.create('server', { filename: 'logger.log' });

const log = logger.log.bind(logger);
const logErr = logger.error.bind(logger);

module.exports = { log, logErr };

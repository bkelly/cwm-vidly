const winston = require('winston');
const express = require('express');
const app = express();

require('../startup/logging')(app);
require('../startup/db')();
require('../startup/frontend')(app);
require('../startup/config')();
require('../startup/validation');
require('../startup/routes')(app);

//Assigning port 0 to randomise the port opened
const server = app.listen(0, () => winston.info('Starting webserver...'));
winston.info(`Listening on PORT ${server.address().port}`);

module.exports = server;
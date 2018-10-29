const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/db')();
require('./startup/frontend')(app);
require('./startup/config')();
require('./startup/validation');
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`listening on port ${port}`));

module.exports = server;
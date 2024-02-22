const express = require('express');
const debug = require('./startup/debug');

const app = express();

require('dotenv').config();

require('express-async-errors');
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => debug(`Listening on port ${port}`));

module.exports = server;

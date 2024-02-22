const mongoose = require('mongoose');
const debug = require('./debug');

module.exports = function connectDatabase() {
  return mongoose
    .connect(process.env.DATABASE_CONNECTION)
    .then(() => debug('Connected to MongoDB...'));
};

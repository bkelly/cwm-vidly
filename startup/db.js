const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    mongoose.connect(config.get('database'), { useNewUrlParser: true })
        .then(() => winston.info('Connected to MongoDB'));
}
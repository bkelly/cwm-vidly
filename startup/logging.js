const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors');
//const debugStartup = require('debug')('app:startup');
//const debugDB = require('debug')('app:db');
//const morgan = require('morgan');
const config = require('config');

module.exports = function(app) {
    winston.handleExceptions(
        
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'logfile.log'})
    );

    process.on("uncaughtException", (ex) => {
        console.log(ex.message, ex);
    });
    
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    
    winston.add(winston.transports.File, { 
        filename: './logfile.log' 
    });

    /*
    winston.add(winston.transports.MongoDB, { 
        db: config.get('database'),
        level: 'info' 
    });
    */
    /*
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debugStartup("Logging enabled via Morgan");
    }
    debugDB("Connected to MongoDB");
    */
}
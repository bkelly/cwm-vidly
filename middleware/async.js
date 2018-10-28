//Currently not in use as library 'express-async-errors' is installed
module.exports = function(handler) {
    return async(req, res, next) => {
        try {
            await handler(req, res);
        } catch(ex) {
            next(ex);
        }
    };
}
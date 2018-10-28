const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    console.log(req.user);
    if(!req.user.isAdmin) return res.status(403).send('User does not have sufficient privileges.');
    next();
}


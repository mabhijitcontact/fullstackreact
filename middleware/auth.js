const jwt = require('jsonwebtoken');
const config = require('config');
var log4js = require("log4js");
var logger = require('../logger/logger');


module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        logger.addLog('ERROR', { msg: 'No token, authorization denied' });
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }

    try {
        const decode = jwt.verify(token, config.get('jwtToken'));
        req.user = decode.user;
        next();
    } catch (err) {
        logger.addLog({ msg: 'Token is invalid' });
        res.status(401).json({
            msg: 'Token is invalid'
        });
    }
};
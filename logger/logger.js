const log4js = require("log4js");

log4js.configure({ // configure to use all types in different files.
    appenders: {
        'file': {
            type: 'file',
            filename: "./logger/logs/error.log", // specify the path where u want logs folder error.log
            category: 'error',
            maxLogSize: 20480,
            backups: 10
        }
    },
    categories: { default: { appenders: ['file'], level: 'error' } }

});

const loggererror = log4js.getLogger('error'); // initialize the var to use.
module.exports.addLog = function (err) {
    loggererror.error(err.msg);
}











/*,
        {
            type: "file",
            filename: "/logs/info.log", // specify the path where u want logs folder info.log
            category: 'info',
            maxLogSize: 20480,
            backups: 10
        },
        {
            type: 'file',
            filename: "/logs/debug.log", // specify the path where u want logs folder debug.log
            category: 'debug',
            maxLogSize: 20480,
            backups: 10
        }]
*/
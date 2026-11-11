const winston  = require('winston');
const { format, level, prettyPrint } = require('winston');
const timezoned = () => {
    return new Date().toLocaleString('en-ID', {
        timeZone: 'Asia/Jakarta'
    });
}

require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '1g',
    format:format.combine(format.timestamp({ format: timezoned }),format.prettyPrint()),
    level: 'info'
});

transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
});

var logger = winston.createLogger({
    transports: [
    transport
    ]
});


module.exports = { logger };
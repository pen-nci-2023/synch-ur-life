const fs = require('fs');
const path = require('path');

// Generate a timestamped log filename
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const logFileName = `log_${timestamp}.log`;
const logFilePath = path.join(__dirname, '../logs', logFileName);

// Ensure log directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Function to append logs to a file
const appendLogToFile = (message) => {
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

const info = (message) => {
    const logMessage = `INFO: ${new Date().toISOString()} - ${message}`;
    console.log(logMessage);
    appendLogToFile(logMessage);
};

const error = (message) => {
    const logMessage = `ERROR: ${new Date().toISOString()} - ${message}`;
    console.error(logMessage);
    appendLogToFile(logMessage);
};

const debug = (message) => {
    const logMessage = `DEBUG: ${new Date().toISOString()} - ${message}`;
    console.debug(logMessage);
    appendLogToFile(logMessage);
};

module.exports = {
    info,
    error,
    debug
};

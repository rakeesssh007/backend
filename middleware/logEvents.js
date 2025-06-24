const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const fsPromises = fs.promises;

// Async function to log events
const logEvents = async (message, fileName) => {
    const dateTime = format(new Date(), "dd:MM:yyyy\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${message}`;

    try {
        const logDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logDir)) {
            await fsPromises.mkdir(logDir);
        }
        await fsPromises.appendFile(path.join(logDir, fileName), `${logItem}\n`);
    } catch (error) {
        console.log(error.message);
    }
};

// Logger middleware
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin || 'no-origin'}\t${req.url}`, 'reqLog.txt');
    console.log(req.method, req.url);
    next();
};

module.exports = { logEvents, logger };

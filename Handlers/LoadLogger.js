const chalk = require('chalk');

const log = (level, message) => {
    const levels = {
        info: chalk.blue,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red
    };

    const color = levels[level] || chalk.white;
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${chalk.gray(timestamp)} ${color(level.toUpperCase())} ${chalk.white(message)}`);
};

module.exports = { log };
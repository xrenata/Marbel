const { ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	execute(client) {
		client.log('info', `Logged in as ${chalk.red(client.user.tag)}`);
        client.user.setActivity(client.config.status.text, { type: ActivityType[client.config.status.activity] });
        client.user.setStatus(client.config.status.type);
	},
};
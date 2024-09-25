const { ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.log('info', `Logged in as ${client.user.tag}`);
        client.user.setActivity(client.config.status.text, { type: ActivityType[client.config.status.type] });
        client.user.setStatus(client.config.status.activity);
	},
};
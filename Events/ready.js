const { ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.log('info', `Logged in as ${client.user.tag}`);
        client.user.setActivity('Merhaba Dünya!', { type: ActivityType.CustomStatus });
        client.user.setStatus('dnd');
	},
};
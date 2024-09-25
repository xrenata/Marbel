const { Client, Collection, GatewayIntentBits } = require('discord.js');
const chalk = require('chalk');
const yaml = require('js-yaml');
const fs = require('fs');

const LoadCommands = require('./Handlers/LoadCommands');
const LoadEvents = require('./Handlers/LoadEvents');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
	]
});

client.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
client.slashCommands = new Collection();
client.contextMenus = new Collection();
client.log = require('./Handlers/LoadLogger').log;
LoadCommands(client)
LoadEvents(client)

process.on('uncaughtException', function (error) {
	client.log('error', 'Uncaught Exception: ' + error.stack)
})

client.login(client.config.token);
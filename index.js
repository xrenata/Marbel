// Description: Main file for the bot.
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');

// Handlers
const LoadCommands = require('./Handlers/LoadCommands');
const LoadEvents = require('./Handlers/LoadEvents');
const LoadDatabase = require('./Handlers/LoadDatabase');

// Client Initialization
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

// Client Variables
client.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
client.slashCommands = new Collection();
client.contextMenus = new Collection();
client.log = require('./Handlers/LoadLogger').log;

// Load Handlers
LoadCommands(client)
LoadEvents(client)
LoadDatabase(client)

// Uncaught Exception
process.on('uncaughtException', function (error) {
	client.log('error', 'Uncaught Exception: ' + error.stack)
})

// Client Login
client.login(client.config.token);
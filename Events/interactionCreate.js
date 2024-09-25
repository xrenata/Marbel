const ChatInputInteraction = require('./interaction/ChatInput');
const ContextMenuInteraction = require('./interaction/ContextMenu');
const Blacklist = require('../Models/Blacklist');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const isBlacklisted = await Blacklist.findOne({ userId: interaction.user.id });
		if (isBlacklisted) {
			return interaction.reply({ content: 'You are blacklisted from using this bot.', ephemeral: true });
		}
		if (interaction.isChatInputCommand()) await ChatInputInteraction(interaction)
		else if (interaction.isContextMenuCommand()) await ContextMenuInteraction(interaction)
	},
};
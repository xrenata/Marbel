const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ChatInputInteraction = require('./interaction/ChatInput');
const ContextMenuInteraction = require('./interaction/ContextMenu');
const NoteInteraction = require('./interaction/NoteAutoComplete');
const AdminAutoComplete = require('./interaction/AdminAutoComplete');
const User = require('../Models/User');
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		if (interaction.isChatInputCommand()) await ChatInputInteraction(interaction)
		else if (interaction.isContextMenuCommand()) await ContextMenuInteraction(interaction)
		else if (interaction.isAutocomplete()) await AdminAutoComplete(interaction) || await NoteInteraction(interaction) 
		else if (interaction.isButton()) {
			if (interaction.customId === 'accept_policy') {
				User.create({ 
					userId: interaction.user.id,
					policyAccepted: true,
					acceptedAt: new Date(),
				});
				await interaction.update({ content: 'You have accepted the policy.', embeds: [] ,components: [] });
			}
		}
	},
};
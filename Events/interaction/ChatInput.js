const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const Blacklist = require('../../Models/Blacklist')
const User = require('../../Models/User')
module.exports = async function ChatInputInteraction(interaction) {
    const command = interaction.client.slashCommands.get(interaction.commandName);
    const policyAccepted = await User.findOne({ userId: interaction.user.id });
    if (!policyAccepted) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#0099ff').setTitle('Policy Acceptance').setDescription('By accepting this policy, you agree to allow us to monitor your Spotify data, which will be publicly available.')], 
            content: 'You need to accept the privacy policy to use this bot.', components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('accept_policy').setLabel('Accept').setStyle('Success')
        )], ephemeral: true });
    }
    const isBlacklisted = await Blacklist.findOne({ userId: interaction.user.id });
    if (isBlacklisted) {
        return interaction.reply({ content: 'You are blacklisted from using this bot.', ephemeral: true });
    }
    if (!command) {
        interaction.client.log('error', `No command matching ${interaction.commandName} was found.`);
        return interaction.reply({ content: 'Command not found maybe this is an error.', ephemeral: true })
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        interaction.client.log("error", `Error executing ${interaction.commandName}`);
        console.error(error);
    }
}